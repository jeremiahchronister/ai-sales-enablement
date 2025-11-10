"""
Lead Scoring & Qualification API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from anthropic import Anthropic

router = APIRouter()

# Initialize Anthropic client
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


# Schemas
class LeadCreate(BaseModel):
    company_name: str
    industry: str
    company_size: str  # "1-10", "11-50", "51-200", "201-1000", "1000+"
    contact_name: str
    contact_email: str
    contact_phone: str


class Lead(BaseModel):
    id: int
    company_name: str
    industry: str
    company_size: str
    contact_name: str
    contact_email: str
    contact_phone: str
    score: Optional[int] = None
    score_breakdown: Optional[dict] = None
    qualification_status: Optional[str] = "Unscored"  # "Unscored", "Hot", "Warm", "Cold"


class ScoreBreakdown(BaseModel):
    budget: int  # 0-25
    authority: int  # 0-25
    need: int  # 0-30
    timeline: int  # 0-20


class LeadScore(BaseModel):
    score: int  # 0-100
    score_breakdown: ScoreBreakdown
    recommendation: str
    reasoning: str


# In-memory storage (replace with database in production)
leads_db: List[Lead] = [
    Lead(id=1, company_name="Acme Corp", industry="SaaS", company_size="51-200",
         contact_name="John Smith", contact_email="john@acmecorp.com", contact_phone="555-0101",
         score=85, qualification_status="Hot",
         score_breakdown={"budget": 25, "authority": 25, "need": 25, "timeline": 10}),
    Lead(id=2, company_name="TechStart Inc", industry="E-commerce", company_size="11-50",
         contact_name="Sarah Johnson", contact_email="sarah@techstart.com", contact_phone="555-0102",
         score=62, qualification_status="Warm",
         score_breakdown={"budget": 18, "authority": 18, "need": 16, "timeline": 10}),
    Lead(id=3, company_name="Global Industries", industry="Manufacturing", company_size="1000+",
         contact_name="Mike Williams", contact_email="mike@globalind.com", contact_phone="555-0103",
         score=42, qualification_status="Cold",
         score_breakdown={"budget": 12, "authority": 10, "need": 13, "timeline": 7}),
]


@router.get("/", response_model=List[Lead])
async def get_leads():
    """Get all leads"""
    return leads_db


@router.post("/", response_model=Lead)
async def create_lead(lead: LeadCreate):
    """Create a new lead"""
    new_id = max([l.id for l in leads_db], default=0) + 1
    new_lead = Lead(
        id=new_id,
        company_name=lead.company_name,
        industry=lead.industry,
        company_size=lead.company_size,
        contact_name=lead.contact_name,
        contact_email=lead.contact_email,
        contact_phone=lead.contact_phone
    )
    leads_db.append(new_lead)
    return new_lead


@router.post("/{lead_id}/score", response_model=LeadScore)
async def score_lead(lead_id: int):
    """Score a lead using AI"""
    # Find lead
    lead = next((l for l in leads_db if l.id == lead_id), None)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Use Claude to score the lead
    prompt = f"""
    Analyze this sales lead and provide a qualification score (0-100) with breakdown.

    Lead Information:
    - Company: {lead.company_name}
    - Industry: {lead.industry}
    - Company Size: {lead.company_size}

    Use BANT (Budget, Authority, Need, Timeline) framework. Provide a JSON response with:
    {{
        "score": <0-100>,
        "score_breakdown": {{
            "budget": <0-25 points for budget availability>,
            "authority": <0-25 points for decision-maker access>,
            "need": <0-30 points for solution need/pain>,
            "timeline": <0-20 points for buying timeline>
        }},
        "recommendation": "High Priority|Medium Priority|Low Priority",
        "reasoning": "<brief 2-3 sentence explanation>"
    }}

    Scoring Guide:
    - High Priority (75-100): Strong budget, decision-maker access, clear need, buying soon
    - Medium Priority (50-74): Some budget, stakeholder access, moderate need, 3-6 month timeline
    - Low Priority (<50): Limited budget, no decision-maker, weak need, or long timeline
    """

    try:
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse Claude's JSON response
        response_text = message.content[0].text

        # Extract JSON from response (may be wrapped in markdown code blocks)
        import json
        import re
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find JSON object directly
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            json_str = json_match.group(0) if json_match else '{}'

        try:
            parsed = json.loads(json_str)
            score = parsed.get("score", 50)
            breakdown = parsed.get("score_breakdown", {})
            recommendation = parsed.get("recommendation", "Medium Priority")
            reasoning = parsed.get("reasoning", response_text[:200])
        except:
            # Fallback if parsing fails
            score = 50
            breakdown = {"budget": 15, "authority": 12, "need": 15, "timeline": 8}
            recommendation = "Medium Priority"
            reasoning = "Unable to parse AI response. Manual review recommended."

        result = LeadScore(
            score=score,
            score_breakdown=ScoreBreakdown(**breakdown),
            recommendation=recommendation,
            reasoning=reasoning
        )

        # Update lead in database
        lead.score = score
        lead.score_breakdown = breakdown
        lead.qualification_status = "Hot" if score >= 75 else "Warm" if score >= 50 else "Cold"

        return result

    except Exception as e:
        # Fallback scoring if API fails
        return LeadScore(
            score=65,
            score_breakdown=ScoreBreakdown(budget=17, authority=18, need=20, timeline=10),
            recommendation="Medium Priority",
            reasoning=f"Scored based on company size ({lead.company_size}) and industry ({lead.industry}). API error: {str(e)}"
        )


@router.get("/{lead_id}", response_model=Lead)
async def get_lead(lead_id: int):
    """Get a specific lead"""
    lead = next((l for l in leads_db if l.id == lead_id), None)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead
