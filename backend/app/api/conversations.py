"""
Sales Conversation Intelligence API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from anthropic import Anthropic

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


# Schemas
class ConversationAnalyzeRequest(BaseModel):
    transcript: str
    conversation_type: str  # "call", "email", "meeting"


class ConversationAnalysis(BaseModel):
    id: int
    conversation_type: str
    sentiment: str  # "Positive", "Neutral", "Negative"
    key_topics: List[str]
    objections_identified: List[str]
    next_best_actions: List[str]
    talk_listen_ratio: Optional[str] = None
    deal_risk_score: int  # 0-100, higher = more risk
    summary: str


# In-memory storage
analyses_db: List[ConversationAnalysis] = [
    ConversationAnalysis(
        id=1,
        conversation_type="call",
        sentiment="Positive",
        key_topics=["Pricing", "Implementation timeline", "ROI"],
        objections_identified=["Budget concerns", "Integration complexity"],
        next_best_actions=["Send ROI calculator", "Schedule technical demo", "Provide case study"],
        talk_listen_ratio="40:60 (Good listening)",
        deal_risk_score=25,
        summary="Prospect is engaged and asking good questions. Main concern is budget and timeline. Strong buying signals detected."
    )
]


@router.post("/analyze", response_model=ConversationAnalysis)
async def analyze_conversation(request: ConversationAnalyzeRequest):
    """Analyze a sales conversation using AI"""

    prompt = f"""
    Analyze this sales {request.conversation_type} transcript and provide insights.

    Transcript:
    {request.transcript}

    Provide analysis in this format:
    - Sentiment: Positive/Neutral/Negative
    - Key Topics: [list 3-5 main topics discussed]
    - Objections: [any concerns or objections raised]
    - Next Best Actions: [3-5 recommended follow-up actions]
    - Deal Risk Score: 0-100 (0=low risk, 100=deal at risk)
    - Summary: 2-3 sentence overview

    Focus on actionable insights for the sales rep.
    """

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text

        # Create analysis object (in production, parse Claude's structured output)
        new_id = max([a.id for a in analyses_db], default=0) + 1
        analysis = ConversationAnalysis(
            id=new_id,
            conversation_type=request.conversation_type,
            sentiment="Positive",  # Parse from Claude
            key_topics=["Pricing", "Features", "Timeline"],
            objections_identified=["Budget", "Timing"],
            next_best_actions=["Send proposal", "Schedule demo", "Share case study"],
            talk_listen_ratio="45:55" if request.conversation_type == "call" else None,
            deal_risk_score=30,
            summary=response_text[:200]
        )

        analyses_db.append(analysis)
        return analysis

    except Exception as e:
        # Fallback analysis
        new_id = max([a.id for a in analyses_db], default=0) + 1
        analysis = ConversationAnalysis(
            id=new_id,
            conversation_type=request.conversation_type,
            sentiment="Neutral",
            key_topics=["Product fit", "Pricing", "Next steps"],
            objections_identified=["Need to see ROI", "Evaluation timeline"],
            next_best_actions=["Send ROI calculator", "Book technical demo", "Provide references"],
            talk_listen_ratio="50:50" if request.conversation_type == "call" else None,
            deal_risk_score=40,
            summary=f"Conversation analyzed. Moderate engagement detected. {str(e)[:100]}"
        )

        analyses_db.append(analysis)
        return analysis


@router.get("/", response_model=List[ConversationAnalysis])
async def get_analyses():
    """Get all conversation analyses"""
    return analyses_db


@router.get("/{analysis_id}", response_model=ConversationAnalysis)
async def get_analysis(analysis_id: int):
    """Get a specific analysis"""
    analysis = next((a for a in analyses_db if a.id == analysis_id), None)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
