"""
Automated Proposal Generation API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from anthropic import Anthropic

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))


# Schemas
class ProposalRequest(BaseModel):
    lead_id: int
    product_type: str  # "SaaS", "Enterprise Software", "Consulting"
    deal_size: int
    contract_term: str  # "Monthly", "Annual", "Multi-year"
    custom_requirements: Optional[str] = ""


class Proposal(BaseModel):
    id: int
    lead_id: int
    company_name: str
    title: str
    executive_summary: str
    solution_overview: str
    pricing: dict
    timeline: str
    next_steps: str
    generated_at: str


# In-memory storage
proposals_db: List[Proposal] = []


@router.post("/generate", response_model=Proposal)
async def generate_proposal(request: ProposalRequest):
    """Generate an AI-powered proposal"""

    prompt = f"""
    Create a professional sales proposal for a {request.product_type} solution.

    Deal Details:
    - Deal Size: ${request.deal_size:,}
    - Contract Term: {request.contract_term}
    - Custom Requirements: {request.custom_requirements or "Standard implementation"}

    Generate a proposal with these sections:
    1. Executive Summary (3-4 sentences)
    2. Solution Overview (why this solves their problem)
    3. Pricing breakdown
    4. Implementation Timeline
    5. Next Steps

    Keep it professional, concise, and compelling. Focus on business value and ROI.
    """

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        content = message.content[0].text

        # Create proposal object
        new_id = max([p.id for p in proposals_db], default=0) + 1
        proposal = Proposal(
            id=new_id,
            lead_id=request.lead_id,
            company_name=f"Lead #{request.lead_id}",
            title=f"{request.product_type} Solution Proposal",
            executive_summary=content[:300],  # First 300 chars
            solution_overview=content[300:800] if len(content) > 300 else content,
            pricing={
                "base_price": request.deal_size,
                "term": request.contract_term,
                "monthly": request.deal_size // 12 if request.contract_term == "Annual" else request.deal_size
            },
            timeline="90-day implementation",
            next_steps="Schedule discovery call to refine requirements",
            generated_at="2024-11-07"
        )

        proposals_db.append(proposal)
        return proposal

    except Exception as e:
        # Fallback proposal if API fails
        new_id = max([p.id for p in proposals_db], default=0) + 1
        proposal = Proposal(
            id=new_id,
            lead_id=request.lead_id,
            company_name=f"Lead #{request.lead_id}",
            title=f"{request.product_type} Solution Proposal",
            executive_summary=f"Comprehensive {request.product_type} solution designed to streamline your operations and drive measurable ROI. Our platform integrates seamlessly with your existing systems.",
            solution_overview="Our solution addresses your key challenges through AI-powered automation, intuitive workflows, and real-time analytics. Expected outcomes: 35% efficiency gain, 22% cost reduction, 90-day payback period.",
            pricing={
                "base_price": request.deal_size,
                "term": request.contract_term,
                "monthly": request.deal_size // 12 if request.contract_term == "Annual" else request.deal_size
            },
            timeline="90-day implementation with dedicated onboarding",
            next_steps="Schedule technical deep-dive and executive business review",
            generated_at="2024-11-07"
        )

        proposals_db.append(proposal)
        return proposal


@router.get("/", response_model=List[Proposal])
async def get_proposals():
    """Get all proposals"""
    return proposals_db


@router.get("/{proposal_id}", response_model=Proposal)
async def get_proposal(proposal_id: int):
    """Get a specific proposal"""
    proposal = next((p for p in proposals_db if p.id == proposal_id), None)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal
