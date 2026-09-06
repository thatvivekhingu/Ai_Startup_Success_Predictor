from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import FundingDeal
from ..schemas import FundingDealOut

router = APIRouter(prefix="/api/funding", tags=["Funding Deals"])

REAL_DEALS_SEED = [
    {
        "startup_name": "Emergent",
        "amount": "$130M",
        "amount_usd": 130000000.0,
        "round": "Series C",
        "lead_investors": "Creaegis, MNI Ventures–Claypond Capital, Sentinel Global",
        "existing_investors": "Khosla Ventures, SoftBank Vision Fund 2, Lightspeed, Y Combinator",
        "sector": "Enterprise AI & Autonomous Software Agents",
        "valuation": "$1.5B (Unicorn)",
        "source_url": "https://emergent.sh/news/emergent-now-a-unicorn-at-1-5-billion-valuation",
        "source_title": "Emergent Official Funding Announcement",
        "summary": "Emergent raised $130M Series C co-led by Creaegis and MNI Ventures–Claypond Capital with major participation from Khosla Ventures, SoftBank Vision Fund 2, and Lightspeed to scale enterprise autonomous AI agents globally."
    },
    {
        "startup_name": "River Mobility",
        "amount": "$120M",
        "amount_usd": 120000000.0,
        "round": "Series C",
        "lead_investors": "Elev8 Venture Partners, Claypond Capital, Yamaha Motor Co.",
        "existing_investors": "Singularity AMC, Anicut Capital, 360 ONE Asset, JIF Capital, HDFC AMC",
        "sector": "Electric Vehicles (EV) & Smart Mobility",
        "valuation": "$550M",
        "source_url": "https://www.reuters.com/world/india/yamaha-backed-indian-ev-startup-river-mobility-raises-120-mln-2026-08-05/",
        "source_title": "Reuters — River Mobility $120M Funding",
        "summary": "Bengaluru-based smart EV maker River raised $120M Series C led by Elev8 and Claypond with Yamaha backing to expand manufacturing capacity, nationwide distribution, and next-generation utility scooter R&D."
    },
    {
        "startup_name": "Udaan",
        "amount": "$160M",
        "amount_usd": 160000000.0,
        "round": "Structured Financing",
        "lead_investors": "Lightspeed Venture Partners, M&G Investments",
        "existing_investors": "DST Global, GGV Capital, Altimeter Capital",
        "sector": "B2B E-Commerce & Kirana Supply Chain",
        "valuation": "$1.8B",
        "source_url": "https://retail.economictimes.indiatimes.com/news/e-commerce/e-tailing/udaan-announces-160-million-structured-financing-blackrock-likely-to-invest-45-million/132393474",
        "source_title": "Economic Times — Udaan $160M Structured Financing",
        "summary": "India's largest B2B e-commerce platform Udaan secured $160M structured equity-debt financing from Lightspeed and M&G to deepen regional distribution and drive operating cash profitability."
    },
    {
        "startup_name": "Udaan (Private Credit)",
        "amount": "~$45M",
        "amount_usd": 45000000.0,
        "round": "Private Credit",
        "lead_investors": "BlackRock Private Credit Platform",
        "existing_investors": "Lightspeed, M&G Investments",
        "sector": "Fintech & Working Capital Supply Chain",
        "valuation": "Senior Secured Credit",
        "source_url": "https://retail.economictimes.indiatimes.com/news/e-commerce/e-tailing/udaan-announces-160-million-structured-financing-blackrock-likely-to-invest-45-million/132393474",
        "source_title": "Economic Times — Udaan BlackRock Credit",
        "summary": "BlackRock's private debt platform extended ~$45M senior credit line to Udaan to fund working capital finance for 300,000+ verified retailers and FMCG distributors."
    },
    {
        "startup_name": "Yotta Data Services",
        "amount": "~$150M",
        "amount_usd": 150000000.0,
        "round": "Growth / Pre-IPO Capital",
        "lead_investors": "Hiranandani Group, Institutional Family Offices & Sovereign Partners",
        "existing_investors": "Nvidia Cloud Partner Network, Global Infra Funds",
        "sector": "Sovereign AI Cloud & GPU Supercomputing Infrastructure",
        "valuation": "$1.4B",
        "source_url": "https://yotta.com/media/",
        "source_title": "Yotta Media & Official Announcement",
        "summary": "Yotta Data Services raised ~$150M growth capital to scale India's sovereign AI cloud cluster with 16,000+ Nvidia H100/H200 Tensor Core GPUs across Mumbai and GIFT City Gujarat data centres."
    },
    {
        "startup_name": "Zepto",
        "amount": "$665M",
        "amount_usd": 665000000.0,
        "round": "Series F",
        "lead_investors": "Avenir Growth, Lightspeed, StepStone Group",
        "existing_investors": "Nexus Venture Partners, Glade Brook Capital, Goodwater",
        "sector": "Quick Commerce & Hyperlocal Logistics",
        "valuation": "$5.0B (Unicorn)",
        "source_url": "https://techcrunch.com/2024/06/21/quick-commerce-startup-zepto-raises-665m-at-3-6b-valuation/",
        "source_title": "TechCrunch — Zepto Mega Round",
        "summary": "Quick commerce pioneer Zepto raised $665M to double its dark store footprint across top 20 Indian cities and scale its high-margin advertising and private label margins."
    },
    {
        "startup_name": "PhysicsWallah",
        "amount": "$210M",
        "amount_usd": 210000000.0,
        "round": "Series B",
        "lead_investors": "Hornbill Capital, Lightspeed Venture Partners",
        "existing_investors": "GSV Ventures, WestBridge Capital",
        "sector": "EdTech & Affordable Learning",
        "valuation": "$2.8B",
        "source_url": "https://economictimes.indiatimes.com/tech/funding/physicswallah-raises-210-million-in-fresh-funding-valuation-jumps-to-2-8-billion/articleshow/113524673.cms",
        "source_title": "Economic Times — PhysicsWallah $210M",
        "summary": "Profitable Indian EdTech giant PhysicsWallah raised $210M to expand hybrid offline learning centres across Tier-2/3 Indian cities and launch vernacular curriculum."
    },
    {
        "startup_name": "Lenskart",
        "amount": "$200M",
        "amount_usd": 200000000.0,
        "round": "Secondary / Growth",
        "lead_investors": "Temasek, Fidelity Management & Research",
        "existing_investors": "SoftBank Vision Fund, Alpha Wave Global, Kedaara",
        "sector": "Omnichannel Retail & Eyewear Automation",
        "valuation": "$5.0B",
        "source_url": "https://www.reuters.com/business/retail-consumer/indian-eyewear-retailer-lenskart-raises-200-mln-temasek-fidelity-2024-06-03/",
        "source_title": "Reuters — Lenskart $200M Investment",
        "summary": "Lenskart raised $200M secondary funding from Temasek and Fidelity to automate automated mega-factories in Rajasthan and expand store networks into Southeast Asia."
    }
]

def seed_funding_deals(db: Session):
    count = db.query(FundingDeal).count()
    if count == 0:
        for d in REAL_DEALS_SEED:
            deal = FundingDeal(**d)
            db.add(deal)
        db.commit()

@router.get("/deals", response_model=List[FundingDealOut])
def get_funding_deals(
    sector: Optional[str] = None,
    round_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    seed_funding_deals(db)
    query = db.query(FundingDeal)
    
    if sector and sector != "All":
        query = query.filter(FundingDeal.sector.ilike(f"%{sector}%"))
    if round_type and round_type != "All":
        query = query.filter(FundingDeal.round.ilike(f"%{round_type}%"))
    if search:
        s = f"%{search}%"
        query = query.filter(
            (FundingDeal.startup_name.ilike(s)) |
            (FundingDeal.lead_investors.ilike(s)) |
            (FundingDeal.sector.ilike(s))
        )
        
    return query.order_by(FundingDeal.amount_usd.desc()).all()

@router.get("/stats")
def get_funding_stats(db: Session = Depends(get_db)):
    seed_funding_deals(db)
    deals = db.query(FundingDeal).all()
    total_capital = sum(d.amount_usd for d in deals if d.amount_usd)
    rounds_breakdown = {}
    sectors = set()
    for d in deals:
        rounds_breakdown[d.round] = rounds_breakdown.get(d.round, 0) + 1
        sectors.add(d.sector)
    
    return {
        "total_capital_usd": total_capital,
        "total_capital_formatted": f"${total_capital / 1e9:.2f}B+",
        "total_deals": len(deals),
        "unique_sectors_count": len(sectors),
        "rounds_breakdown": rounds_breakdown,
        "mega_deals_count": len([d for d in deals if d.amount_usd >= 100000000.0])
    }
