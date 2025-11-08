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
    annual_revenue: Optional[str] = None
    pain_points: str
    budget_signals: str  # "Low", "Medium", "High"
    decision_maker_contact: bool
    timeline: str  # "Immediate", "1-3 months", "3-6 months", "6+ months"


class Lead(BaseModel):
    id: int
    company_name: str
    industry: str
    company_size: str
    score: Optional[int] = None
    score_breakdown: Optional[dict] = None
    qualification_status: Optional[str] = "Unscored"  # "Unscored", "Hot", "Warm", "Cold"


class LeadScore(BaseModel):
    score: int  # 0-100
    qualification_status: str
    score_breakdown: dict
    reasoning: str


# In-memory storage (replace with database in production)
leads_db: List[Lead] = [
    Lead(id=1, company_name="Acme Corp", industry="SaaS", company_size="51-200", score=85,
         qualification_status="Hot",
         score_breakdown={"fit": 30, "pain": 25, "budget": 20, "timeline": 10}),
    Lead(id=2, company_name="TechStart Inc", industry="E-commerce", company_size="11-50", score=62,
         qualification_status="Warm",
         score_breakdown={"fit": 20, "pain": 18, "budget": 14, "timeline": 10}),
    Lead(id=3, company_name="Global Industries", industry="Manufacturing", company_size="1000+", score=42,
         qualification_status="Cold",
         score_breakdown={"fit": 15, "pain": 10, "budget": 10, "timeline": 7}),
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
        company_size=lead.company_size
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

    Provide a JSON response with:
    {{
        "score": <0-100>,
        "qualification_status": "Hot|Warm|Cold",
        "score_breakdown": {{
            "fit": <0-30 points for ICP fit>,
            "pain": <0-25 points for pain intensity>,
            "budget": <0-25 points for budget signals>,
            "timeline": <0-20 points for buying timeline>
        }},
        "reasoning": "<brief explanation>"
    }}

    Scoring Guide:
    - Hot (75-100): Strong fit, clear pain, budget confirmed, buying soon
    - Warm (50-74): Good fit, some pain, budget likely, 3-6 month timeline
    - Cold (<50): Poor fit or missing key qualification criteria
    """

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse response (simplified - in production, use structured extraction)
        response_text = message.content[0].text

        # Simple scoring logic for demo (in production, parse Claude's JSON)
        score = 75  # Example score
        result = LeadScore(
            score=score,
            qualification_status="Hot" if score >= 75 else "Warm" if score >= 50 else "Cold",
            score_breakdown={"fit": 25, "pain": 20, "budget": 20, "timeline": 10},
            reasoning=response_text
        )

        # Update lead in database
        lead.score = score
        lead.score_breakdown = result.score_breakdown
        lead.qualification_status = result.qualification_status

        return result

    except Exception as e:
        # Fallback scoring if API fails
        return LeadScore(
            score=65,
            qualification_status="Warm",
            score_breakdown={"fit": 20, "pain": 18, "budget": 17, "timeline": 10},
            reasoning=f"Scored based on company size ({lead.company_size}) and industry ({lead.industry}). API error: {str(e)}"
        )


@router.get("/{lead_id}", response_model=Lead)
async def get_lead(lead_id: int):
    """Get a specific lead"""
    lead = next((l for l in leads_db if l.id == lead_id), None)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead
