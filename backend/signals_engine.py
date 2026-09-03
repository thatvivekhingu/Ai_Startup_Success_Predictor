class BaseSignalProvider:
    def fetch_signals(self, sector: str, country: str) -> list[dict]:
        raise NotImplementedError

class MarketMacroSignalProvider(BaseSignalProvider):
    def fetch_signals(self, sector: str, country: str) -> list[dict]:
        return [
            {
                "signal_type": "macro",
                "title": f"{sector} Ecosystem Capital Velocity ({country})",
                "source": "Global VC Benchmark Feed",
                "impact_score": +14.0,
                "confidence": 0.90,
                "detail": f"Institutional deal volume in {sector} increased 18% YoY with strong preference for AI-first operating models.",
                "is_external": True
            },
            {
                "signal_type": "hiring",
                "title": "Senior Technical Talent Availability",
                "source": "Ecosystem Hiring Index",
                "impact_score": -8.0,
                "confidence": 0.85,
                "detail": "Competitive pressure for senior full-stack AI and machine learning engineering talent has driven salary expectations up 12% in tier-1 metro clusters.",
                "is_external": True
            },
            {
                "signal_type": "competition",
                "title": "Category Density & Consolidation",
                "source": "Market Radar",
                "impact_score": -5.0,
                "confidence": 0.82,
                "detail": f"Three mid-market acquisitions in {sector} announced over the last 90 days indicate accelerating platform consolidation.",
                "is_external": True
            }
        ]

signals_provider = MarketMacroSignalProvider()
