"""
Competitive Battle Cards API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


# Schemas
class BattleCard(BaseModel):
    id: int
    competitor_name: str
    our_strengths: List[str]
    their_weaknesses: List[str]
    pricing_comparison: str
    key_differentiators: List[str]
    objection_handling: dict


# Pre-built battle cards
battlecards_db: List[BattleCard] = [
    BattleCard(
        id=1,
        competitor_name="Salesforce Sales Cloud",
        our_strengths=["50% lower cost", "AI-first design", "2-week deployment vs 6-month", "Simpler UI"],
        their_weaknesses=["Complex setup", "Expensive ($150/user/mo)", "Slow customization", "Dated UI"],
        pricing_comparison="$150/user (Salesforce) vs $50/user (Us) = 67% savings",
        key_differentiators=["Built-in AI lead scoring", "Automated proposal generation", "No consulting required"],
        objection_handling={
            "But Salesforce is industry standard": "True, but are you using 80% of features you're paying for? Our customers save $100K/year switching to our focused solution.",
            "Integration concerns": "We integrate with Salesforce APIs if needed - best of both worlds."
        }
    ),
    BattleCard(
        id=2,
        competitor_name="HubSpot Sales Hub",
        our_strengths=["Advanced AI capabilities", "Enterprise-grade battle cards", "Better conversation intelligence"],
        their_weaknesses=["Basic AI features", "Limited competitive intelligence", "Call analysis requires add-on"],
        pricing_comparison="$100/user (HubSpot Pro) vs $50/user (Us)",
        key_differentiators=["AI battle cards auto-updated", "Proposal generation included", "Multi-model AI (Claude + GPT)"],
        objection_handling={
            "HubSpot has full CRM": "We integrate with HubSpot CRM - use best tool for each job. We're specialists in AI sales enablement.",
            "Free tier attractive": "Free tier lacks AI features. Compare our $50/user to their $100 Sales Pro tier."
        }
    ),
    BattleCard(
        id=3,
        competitor_name="Gong.io",
        our_strengths=["Lower cost", "Proposal generation", "Battle cards included", "$150/user vs Gong's $300/user"],
        their_weaknesses=["Expensive ($300+/user)", "Conversation analysis only", "No proposal tools", "No battle cards"],
        pricing_comparison="$300/user (Gong) vs $150/user (Us) = 50% savings",
        key_differentiators=["All-in-one platform", "4 tools vs Gong's 1", "Better ROI for SMB"],
        objection_handling={
            "Gong is proven in enterprise": "For 1000+ seat enterprises yes. For 50-500 seats, we deliver 90% of value at 50% cost.",
            "Revenue intelligence focus": "We cover revenue intelligence PLUS lead scoring, proposals, and battle cards in one platform."
        }
    ),
]


@router.get("/", response_model=List[BattleCard])
async def get_battlecards():
    """Get all competitive battle cards"""
    return battlecards_db


@router.get("/{battlecard_id}", response_model=BattleCard)
async def get_battlecard(battlecard_id: int):
    """Get a specific battle card"""
    card = next((b for b in battlecards_db if b.id == battlecard_id), None)
    if not card:
        raise HTTPException(status_code=404, detail="Battle card not found")
    return card
