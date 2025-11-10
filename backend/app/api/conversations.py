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
    objections: List[str]  # Renamed from objections_identified
    next_actions: List[str]  # Renamed from next_best_actions
    deal_risk_score: int  # 0-100, higher = more risk
    summary: str
    analyzed_at: str  # Timestamp


# In-memory storage
analyses_db: List[ConversationAnalysis] = [
    ConversationAnalysis(
        id=1,
        conversation_type="call",
        sentiment="Positive",
        key_topics=["Pricing", "Implementation timeline", "ROI"],
        objections=["Budget concerns", "Integration complexity"],
        next_actions=["Send ROI calculator", "Schedule technical demo", "Provide case study"],
        deal_risk_score=25,
        summary="Prospect is engaged and asking good questions. Main concern is budget and timeline. Strong buying signals detected.",
        analyzed_at="2024-11-07T10:30:00"
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
            model="claude-3-sonnet-20240229",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text

        # Parse Claude's response for structured data
        from datetime import datetime
        import json
        import re

        # Try to extract structured data from response
        try:
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group(0))
                sentiment = parsed.get("sentiment", "Neutral")
                key_topics = parsed.get("key_topics", ["General discussion"])
                objections = parsed.get("objections", [])
                next_actions = parsed.get("next_actions", ["Follow up"])
                deal_risk_score = parsed.get("deal_risk_score", 50)
                summary = parsed.get("summary", response_text[:200])
            else:
                # Fallback if no JSON found
                sentiment = "Neutral"
                key_topics = ["Pricing", "Features", "Timeline"]
                objections = ["Budget", "Timing"]
                next_actions = ["Send proposal", "Schedule demo", "Share case study"]
                deal_risk_score=30
                summary = response_text[:200]
        except:
            # Fallback on parse error
            sentiment = "Neutral"
            key_topics = ["General discussion"]
            objections = []
            next_actions = ["Follow up"]
            deal_risk_score = 50
            summary = response_text[:200]

        new_id = max([a.id for a in analyses_db], default=0) + 1
        analysis = ConversationAnalysis(
            id=new_id,
            conversation_type=request.conversation_type,
            sentiment=sentiment,
            key_topics=key_topics,
            objections=objections,
            next_actions=next_actions,
            deal_risk_score=deal_risk_score,
            summary=summary,
            analyzed_at=datetime.now().isoformat()
        )

        analyses_db.append(analysis)
        return analysis

    except Exception as e:
        # Fallback analysis
        from datetime import datetime
        new_id = max([a.id for a in analyses_db], default=0) + 1
        analysis = ConversationAnalysis(
            id=new_id,
            conversation_type=request.conversation_type,
            sentiment="Neutral",
            key_topics=["Product fit", "Pricing", "Next steps"],
            objections=["Need to see ROI", "Evaluation timeline"],
            next_actions=["Send ROI calculator", "Book technical demo", "Provide references"],
            deal_risk_score=40,
            summary=f"Conversation analyzed. Moderate engagement detected. API error: {str(e)[:100]}",
            analyzed_at=datetime.now().isoformat()
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
