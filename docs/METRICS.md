# Metrics & KPIs: AI Sales Enablement Platform

## Executive Summary

**North Star Metric:** **Revenue Influenced by AI** - Total ARR where sales reps used AI features (lead scoring, proposals, battle cards, conversation intel) during the sales cycle.

**Why This Metric:**
- Directly ties platform usage to business outcome (revenue)
- Aligns product success with customer success
- Justifies renewal decisions (if AI influences $10M revenue, $180K/year platform cost is a no-brainer)

**Target:** Month 24 = $500M revenue influenced across 500 customers (avg $1M per customer)

---

## Metric Framework

### Hierarchy of Metrics

```
┌─────────────────────────────────────────────────────────────┐
│                   NORTH STAR METRIC                          │
│          Revenue Influenced by AI ($500M by M24)             │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴───────────┐
        ▼                        ▼
┌───────────────┐        ┌───────────────┐
│ INPUT METRICS │        │ OUTPUT METRICS│
│ (What we control)      │ (What we achieve)
│                        │               │
│ - Weekly Active Users  │ - Sales Cycle│
│ - Feature Adoption     │ - Win Rate   │
│ - AI Accuracy          │ - Quota Attainment│
└───────────────┘        └───────────────┘
        │                        │
        └────────────┬───────────┘
                     ▼
        ┌────────────────────────┐
        │  BUSINESS METRICS      │
        │  (Financial Health)    │
        │                        │
        │  - MRR Growth          │
        │  - LTV:CAC Ratio       │
        │  - Gross Margin        │
        │  - Net Revenue Retention│
        └────────────────────────┘
```

---

## North Star Metric: Revenue Influenced by AI

### Definition
**Total ARR** from deals where sales reps used at least one AI feature (lead scoring, proposal generation, battle cards, or conversation intelligence) during the sales cycle.

**Calculation:**
```
Revenue Influenced by AI = Σ (Deal ARR × AI Usage Flag)

where AI Usage Flag = 1 if rep used any AI feature during sales cycle, 0 otherwise
```

**Example:**
- Customer Acme Corp closes 100 deals in Q1
- 70 deals used AI lead scoring
- 50 deals used AI proposals
- Total influenced deals: 70 (some overlap)
- Total ARR from those 70 deals: $5M
- **Revenue Influenced by AI = $5M**

### Targets

| Milestone | Timeline | Revenue Influenced | Implied Platform Value |
|-----------|----------|-------------------|------------------------|
| **Pilot** | Month 6 | $10M (10 customers × $1M each) | "Platform helped close $10M in revenue" |
| **Launch** | Month 12 | $100M (50 customers × $2M each) | "Platform helped close $100M in revenue" |
| **Scale** | Month 24 | $500M (500 customers × $1M each) | "Platform helped close $500M in revenue" |

### Why This Matters
- **Customer Renewal:** If AI influenced $10M in revenue, $180K platform cost = 55x ROI → Easy renewal decision
- **Upsell Opportunity:** Show VP Sales: "Your team influenced $10M using AI, expand to 100 reps to influence $20M"
- **Marketing Messaging:** "$500M in revenue influenced by our AI platform" (social proof for new customers)

---

## Input Metrics (What We Control)

### 1. Product Engagement

#### Weekly Active Users (WAU)
**Definition:** Unique users who performed at least one action (lead score, proposal, battle card view, conversation analysis) in the last 7 days.

**Calculation:**
```
WAU = Unique users with ≥1 action in last 7 days
Weekly Active Rate = WAU / Total Seats × 100%
```

**Targets:**

| Phase | Timeline | WAU Target | Rationale |
|-------|----------|------------|-----------|
| **Pilot** | Month 1-6 | 70% | High engagement required to prove value |
| **Launch** | Month 7-12 | 65% | Slight drop as we scale (some inactive users) |
| **Scale** | Month 13-24 | 60% | Mature product, consistent usage |

**Alerts:**
- 🔴 **Critical:** WAU <50% for 2 consecutive weeks → Risk of churn
- 🟡 **Warning:** WAU declining >10% week-over-week → Investigate cause

**Improvement Levers:**
- Email reminders to inactive users
- In-app notifications (e.g., "You have 5 unscored leads")
- Manager dashboards showing team usage (peer pressure)

#### Feature Adoption Rate

**Definition:** % of users who have used each feature at least once in the last 30 days.

**Calculation:**
```
Feature Adoption Rate = (Users who used Feature X in last 30 days) / Total Active Users × 100%
```

**Targets (Month 12):**

| Feature | Adoption Target | Rationale |
|---------|-----------------|-----------|
| **Lead Scoring** | 80% | Most frequent use case (daily activity) |
| **Proposal Generation** | 60% | Not all reps create proposals (some are SDRs) |
| **Battle Cards** | 70% | Competitive deals common (70% of deals have competition) |
| **Conversation Intelligence** | 50% | Requires call recording setup (friction) |

**Improvement Levers:**
- Onboarding checklist: "Score your first lead to unlock proposal feature"
- Feature discovery prompts: "Did you know you can generate proposals in 3 minutes?"
- Manager-led adoption: "All reps must use conversation intel for coaching"

#### Actions Per User Per Week

**Definition:** Average number of AI actions (lead scores, proposals, battle card views, conversation analyses) per active user per week.

**Calculation:**
```
Actions Per User Per Week = Total Actions in Week / WAU
```

**Targets:**

| Phase | Timeline | Actions/User/Week | Rationale |
|-------|----------|-------------------|-----------|
| **Pilot** | Month 1-6 | 15+ | Power users testing all features |
| **Launch** | Month 7-12 | 12+ | Mature usage pattern (2-3 actions/day) |
| **Scale** | Month 13-24 | 10+ | Sustained engagement |

**Segmentation:**
- **Top Quartile Users:** 25+ actions/week (power users, high value)
- **Middle 50%:** 10-25 actions/week (engaged users)
- **Bottom Quartile:** <10 actions/week (at-risk users, need intervention)

**Improvement Levers:**
- Gamification: Leaderboards showing top users
- Weekly email: "You scored 10 leads this week, here's how your peers are doing"
- Integration triggers: "New lead in Salesforce → Auto-remind user to score it"

---

### 2. AI Performance Metrics

#### Lead Scoring Accuracy

**Definition:** Correlation between AI lead score (0-100) and actual close rate.

**Calculation:**
```
Accuracy = Percentage of high-scored leads (>70) that closed vs. low-scored leads (<40) that closed

Expected:
- High-scored leads (>70): 30%+ close rate
- Low-scored leads (<40): <10% close rate
```

**Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Correlation** | R² >0.65 | Linear regression: AI score vs. close rate |
| **High-Score Close Rate** | >30% | % of leads scored >70 that closed |
| **Low-Score Close Rate** | <10% | % of leads scored <40 that closed |

**Improvement Levers:**
- Fine-tune AI prompts with closed-won/closed-lost data
- A/B test different scoring models (BANT vs. MEDDIC)
- Add customer feedback loop: "Was this score accurate?" (thumbs up/down)

#### Proposal Acceptance Rate

**Definition:** % of AI-generated proposals that were sent to prospects without major edits (>50% of content unchanged).

**Calculation:**
```
Proposal Acceptance Rate = Proposals sent with <50% edits / Total proposals generated × 100%
```

**Targets:**

| Phase | Timeline | Acceptance Rate | Rationale |
|-------|----------|----------------|-----------|
| **Pilot** | Month 1-6 | 60% | AI is good enough for most use cases |
| **Launch** | Month 7-12 | 70% | AI improves with feedback |
| **Scale** | Month 13-24 | 80% | AI fine-tuned to customer's style |

**Improvement Levers:**
- Collect rejected proposals → Analyze common edits → Update AI prompts
- Allow customers to customize proposal templates (company branding, tone)
- A/B test different proposal structures (problem-solution vs. ROI-focused)

#### Conversation Intelligence Actionability

**Definition:** % of conversation analyses where sales reps or managers took at least one action (e.g., followed up on objection, updated CRM, scheduled coaching session).

**Calculation:**
```
Actionability Rate = Conversations with ≥1 follow-up action / Total conversations analyzed × 100%
```

**Targets:**

| Phase | Timeline | Actionability Rate | Rationale |
|-------|----------|-------------------|-----------|
| **Pilot** | Month 1-6 | 70% | High engagement (managers actively coaching) |
| **Launch** | Month 7-12 | 60% | Mature usage (not every call needs action) |
| **Scale** | Month 13-24 | 50% | Sustained value (50% of calls have actionable insights) |

**Improvement Levers:**
- Auto-suggest actions: "Prospect mentioned budget concerns → Suggested action: Schedule follow-up call to discuss pricing"
- Integrate with CRM: "Add conversation insights to Salesforce opportunity notes" (1-click)
- Manager dashboard: "5 reps had objection handling issues this week → Suggested action: Schedule coaching session"

---

## Output Metrics (What We Achieve)

### 1. Customer Impact Metrics

#### Sales Cycle Reduction

**Definition:** Average days from lead creation to closed-won, comparing AI users vs. non-AI users.

**Calculation:**
```
Sales Cycle (AI Users) = Avg days from lead creation to close (for deals using AI)
Sales Cycle (Non-AI Users) = Avg days from lead creation to close (for deals not using AI)
Sales Cycle Reduction = (Non-AI - AI) / Non-AI × 100%
```

**Targets:**

| Phase | Timeline | Sales Cycle Reduction | Absolute Days |
|-------|----------|----------------------|---------------|
| **Pilot** | Month 6 | 30% | 90 days → 63 days |
| **Launch** | Month 12 | 28% | 90 days → 65 days |
| **Scale** | Month 24 | 25% | 90 days → 68 days |

**Measurement:**
- Control group: Deals without AI usage
- Treatment group: Deals with AI usage
- **Requirement:** Statistically significant (p <0.05, n >100 deals per group)

#### Win Rate Improvement

**Definition:** % of qualified leads that close as won, comparing AI users vs. non-AI users.

**Calculation:**
```
Win Rate (AI Users) = Closed-won deals using AI / Total qualified leads using AI × 100%
Win Rate (Non-AI Users) = Closed-won deals not using AI / Total qualified leads not using AI × 100%
Win Rate Improvement = Win Rate (AI) - Win Rate (Non-AI)
```

**Targets:**

| Phase | Timeline | Win Rate Improvement | Absolute Rate |
|-------|----------|---------------------|---------------|
| **Pilot** | Month 6 | +4% points | 18% → 22% |
| **Launch** | Month 12 | +4% points | 18% → 22% |
| **Scale** | Month 24 | +5% points | 18% → 23% |

**Segmentation:**
- **Competitive Deals:** Win rate improvement +10% (battle cards help most here)
- **Non-Competitive Deals:** Win rate improvement +2% (AI helps, but less critical)

#### Quota Attainment Improvement

**Definition:** % of sales reps hitting 100%+ of quota, comparing teams using AI vs. teams not using AI.

**Calculation:**
```
Quota Attainment = Reps at ≥100% quota / Total reps × 100%
Quota Attainment Improvement = Quota Attainment (AI teams) - Quota Attainment (Non-AI teams)
```

**Targets:**

| Phase | Timeline | Quota Attainment Improvement | Absolute Rate |
|-------|----------|------------------------------|---------------|
| **Pilot** | Month 6 | +15% points | 65% → 80% |
| **Launch** | Month 12 | +12% points | 70% → 82% |
| **Scale** | Month 24 | +10% points | 75% → 85% |

**Improvement Levers:**
- Focus on bottom-quartile reps (biggest improvement opportunity)
- Manager coaching using conversation intel (targeted improvement)
- Lead scoring helps reps prioritize (avoid wasting time on bad leads)

---

### 2. Product Health Metrics

#### Net Promoter Score (NPS)

**Definition:** Likelihood of users to recommend platform to peers (0-10 scale).

**Calculation:**
```
NPS = % Promoters (9-10) - % Detractors (0-6)
```

**Targets:**

| Phase | Timeline | NPS Target | Industry Benchmark |
|-------|----------|------------|-------------------|
| **Pilot** | Month 6 | 50+ | SaaS avg: 30-40 |
| **Launch** | Month 12 | 55+ | Top quartile SaaS: 50+ |
| **Scale** | Month 24 | 60+ | Best-in-class SaaS: 60-70 |

**Survey Cadence:**
- Quarterly NPS survey to all active users
- Follow-up interviews with Detractors (understand pain points)
- Share Promoter feedback with team (boost morale)

**Improvement Levers:**
- Fix top 3 complaints from Detractors
- Highlight features that Promoters love (double down)
- Close the loop: "You said X was broken, we fixed it in latest release"

#### Customer Health Score

**Definition:** Composite score (0-100) combining usage, NPS, and support tickets.

**Calculation:**
```
Health Score = (40% × WAU) + (30% × Feature Adoption) + (20% × NPS) + (10% × Support Ticket Score)

where:
- WAU: Weekly Active Users % (0-100)
- Feature Adoption: Avg adoption across 4 features (0-100)
- NPS: Normalized NPS (0=0, 60+=100)
- Support Ticket Score: 100 - (Ticket count × 10) (capped at 0)
```

**Targets:**

| Health Score | Status | Action |
|--------------|--------|--------|
| **80-100** | 🟢 Healthy | No action needed |
| **60-79** | 🟡 At-Risk | Proactive outreach (CSM call) |
| **0-59** | 🔴 Critical | Escalation to VP Customer Success |

**Improvement Levers:**
- 🟢 Healthy customers: Upsell opportunity (expand to more seats)
- 🟡 At-Risk customers: Quarterly Business Review (QBR) to address concerns
- 🔴 Critical customers: Exec sponsor engagement (co-founder calls customer)

---

## Business Metrics (Financial Health)

### 1. Revenue Metrics

#### Monthly Recurring Revenue (MRR)

**Definition:** Predictable monthly revenue from subscriptions.

**Calculation:**
```
MRR = Σ (Customer Count × Seats × Price Per Seat)

Example:
- 50 customers
- Avg 75 seats per customer
- $150/seat/month
- MRR = 50 × 75 × $150 = $562,500
```

**Targets:**

| Milestone | Timeline | MRR | ARR | Growth Rate |
|-----------|----------|-----|-----|-------------|
| **Pilot** | Month 6 | $93,750 | $1.125M | N/A (first customers) |
| **Launch** | Month 12 | $468,750 | $5.625M | 400% YoY |
| **Scale** | Month 24 | $4,687,500 | $56.25M | 900% YoY |

**Segmentation:**
- **New MRR:** Revenue from new customers
- **Expansion MRR:** Revenue from existing customers adding seats
- **Contraction MRR:** Revenue lost from customers reducing seats
- **Churned MRR:** Revenue lost from cancelled customers

**Formula:**
```
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR
```

#### Annual Recurring Revenue (ARR)

**Definition:** MRR × 12 (annualized).

**Targets:**

| Milestone | Timeline | ARR | Customer Count | Avg Customer ARR |
|-----------|----------|-----|----------------|------------------|
| **Pilot** | Month 6 | $1.125M | 10 | $112,500 |
| **Launch** | Month 12 | $5.625M | 50 | $112,500 |
| **Scale** | Month 24 | $56.25M | 500 | $112,500 |

**ARR Milestones:**
- $1M ARR → Seed funding viable
- $5M ARR → Series A viable ($10M-$15M raise)
- $50M ARR → Series B viable ($50M-$100M raise) or IPO path

---

### 2. Unit Economics

#### Customer Acquisition Cost (CAC)

**Definition:** Total sales + marketing spend to acquire one new customer.

**Calculation:**
```
CAC = (Sales Expenses + Marketing Expenses) / New Customers Acquired

Example (Month 12):
- Sales expenses: $200K (2 sales reps × $100K fully-loaded)
- Marketing expenses: $100K (ads, conferences, content)
- New customers: 40 (50 total - 10 pilots)
- CAC = $300K / 40 = $7,500 per customer
```

**Targets:**

| Phase | Timeline | CAC Target | Rationale |
|-------|----------|------------|-----------|
| **Pilot** | Month 6 | $10,000 | High-touch sales (founder-led) |
| **Launch** | Month 12 | $8,000 | Sales team scaling |
| **Scale** | Month 24 | $6,000 | Product-led growth kicking in |

**Improvement Levers:**
- Reduce CAC via product-led growth (freemium tier, self-serve trials)
- Optimize marketing spend (focus on highest-converting channels)
- Increase sales rep productivity (better tools, training)

#### Lifetime Value (LTV)

**Definition:** Total revenue from a customer over their lifetime (before churn).

**Calculation:**
```
LTV = ARPA × Gross Margin % × (1 / Churn Rate)

where:
- ARPA = Average Revenue Per Account (annual)
- Gross Margin % = (Revenue - COGS) / Revenue
- Churn Rate = Annual logo churn %

Example (Month 24):
- ARPA = $112,500 (75 seats × $150/month × 12)
- Gross Margin = 82%
- Churn Rate = 15% annually
- LTV = $112,500 × 82% × (1 / 0.15) = $615,000
```

**Targets:**

| Phase | Timeline | LTV Target | Gross Margin | Churn Rate |
|-------|----------|------------|--------------|------------|
| **Pilot** | Month 6 | $350,000 | 70% | 20% (high early churn) |
| **Launch** | Month 12 | $500,000 | 78% | 18% |
| **Scale** | Month 24 | $615,000 | 82% | 15% |

#### LTV:CAC Ratio

**Definition:** Lifetime value divided by customer acquisition cost.

**Calculation:**
```
LTV:CAC = LTV / CAC

Example (Month 24):
- LTV = $615,000
- CAC = $6,000
- LTV:CAC = 102.5:1 ✅
```

**Targets:**

| Phase | Timeline | LTV:CAC Target | Health Indicator |
|-------|----------|----------------|------------------|
| **Pilot** | Month 6 | 35:1 | Healthy (target: >3:1) |
| **Launch** | Month 12 | 62.5:1 | Very healthy |
| **Scale** | Month 24 | 102.5:1 | Exceptional |

**Industry Benchmarks:**
- <3:1 → ⚠️ Unsustainable (spending too much to acquire customers)
- 3:1-5:1 → ✅ Healthy (sustainable growth)
- >5:1 → ✅✅ Excellent (high-efficiency growth)

#### CAC Payback Period

**Definition:** Months to recover customer acquisition cost from gross profit.

**Calculation:**
```
CAC Payback Period = CAC / (ARPA × Gross Margin % / 12)

Example (Month 24):
- CAC = $6,000
- ARPA = $112,500
- Gross Margin = 82%
- CAC Payback = $6,000 / ($112,500 × 82% / 12) = 0.78 months ✅
```

**Targets:**

| Phase | Timeline | Payback Period | Rationale |
|-------|----------|----------------|-----------|
| **Pilot** | Month 6 | 4 months | High CAC, lower margin |
| **Launch** | Month 12 | 2 months | Improved efficiency |
| **Scale** | Month 24 | 0.78 months | Highly efficient |

**Industry Benchmarks:**
- <12 months → ✅ Good (cash-efficient)
- 12-18 months → ⚠️ Acceptable (needs improvement)
- >18 months → ❌ Poor (cash burn risk)

---

### 3. Growth Metrics

#### Net Revenue Retention (NRR)

**Definition:** Revenue retained from existing customers (including expansions, contractions, churn).

**Calculation:**
```
NRR = (Starting ARR + Expansion ARR - Contraction ARR - Churned ARR) / Starting ARR × 100%

Example (Year 2):
- Starting ARR (Jan 1): $5.625M (50 customers)
- Expansion ARR: $1.125M (10 customers added 15 seats each)
- Contraction ARR: $225K (5 customers reduced seats)
- Churned ARR: $562.5K (5 customers cancelled)
- Ending ARR: $5.625M + $1.125M - $225K - $562.5K = $5.9625M
- NRR = $5.9625M / $5.625M = 106% ✅
```

**Targets:**

| Phase | Timeline | NRR Target | Interpretation |
|-------|----------|------------|----------------|
| **Pilot** | Month 12 | 90% | Early churn expected |
| **Launch** | Month 18 | 100% | Break-even on retention |
| **Scale** | Month 24 | 110%+ | Growth from existing customers |

**Industry Benchmarks:**
- <90% → ❌ Poor (losing revenue faster than adding it)
- 90-100% → ⚠️ Needs improvement
- 100-110% → ✅ Good
- >110% → ✅✅ Excellent (best-in-class SaaS)

**Improvement Levers:**
- Reduce churn: Improve onboarding, proactive CSM outreach
- Increase expansion: Upsell to more seats, cross-sell new features
- Prevent contraction: Quarterly Business Reviews (QBRs) to address concerns early

#### Logo Retention Rate

**Definition:** % of customers retained (not churned) annually.

**Calculation:**
```
Logo Retention = (Customers at end of year - New customers in year) / Customers at start of year × 100%

Example (Year 2):
- Customers Jan 1: 50
- New customers in year: 450
- Customers Dec 31: 500
- Churned customers: 50 - (500 - 450) = 0 (all retained)
- Logo Retention = (500 - 450) / 50 = 100% ✅
```

**Targets:**

| Phase | Timeline | Logo Retention | Churn Rate |
|-------|----------|---------------|------------|
| **Pilot** | Month 12 | 80% | 20% (high early churn) |
| **Launch** | Month 18 | 85% | 15% |
| **Scale** | Month 24 | 90%+ | <10% |

**Industry Benchmarks:**
- <80% → ❌ Poor (1 in 5 customers leave annually)
- 80-90% → ✅ Good
- >90% → ✅✅ Excellent

#### Monthly Growth Rate

**Definition:** % increase in MRR month-over-month.

**Calculation:**
```
Monthly Growth Rate = (MRR this month - MRR last month) / MRR last month × 100%

Example (Month 12):
- MRR Month 11: $450,000
- MRR Month 12: $468,750
- Growth Rate = ($468,750 - $450,000) / $450,000 = 4.2%
```

**Targets:**

| Phase | Timeline | Monthly Growth Rate | Annual Growth Rate (CAGR) |
|-------|----------|-------------------|--------------------------|
| **Pilot** | Month 1-6 | 50%+ | N/A (small base) |
| **Launch** | Month 7-12 | 15-20% | 400%+ |
| **Scale** | Month 13-24 | 10-15% | 200-300% |

---

## Instrumentation & Tracking

### Data Collection

**Event Tracking (Segment/Mixpanel):**

| Event | Properties | Purpose |
|-------|-----------|---------|
| `lead_scored` | `user_id`, `lead_id`, `score`, `timestamp` | Track lead scoring usage |
| `proposal_generated` | `user_id`, `lead_id`, `deal_size`, `timestamp` | Track proposal usage |
| `battle_card_viewed` | `user_id`, `competitor`, `timestamp` | Track battle card usage |
| `conversation_analyzed` | `user_id`, `conversation_id`, `sentiment`, `timestamp` | Track conversation intel usage |
| `user_logged_in` | `user_id`, `timestamp` | Track WAU |
| `feature_adopted` | `user_id`, `feature_name`, `timestamp` | Track first-time feature usage |

**Revenue Tracking (Stripe/Chargebee):**
- `subscription_created`: New customer MRR
- `subscription_updated`: Expansion/contraction MRR
- `subscription_cancelled`: Churned MRR

**CRM Integration (Salesforce):**
- `opportunity_created`: New deal
- `opportunity_updated`: Deal stage changes
- `opportunity_closed_won`: Closed-won revenue (for revenue influenced calculation)

### Dashboard Requirements

**Exec Dashboard (Weekly Review):**
- North Star Metric: Revenue Influenced by AI (trend over 12 weeks)
- MRR Growth (chart showing new, expansion, contraction, churn)
- WAU (% of seats active)
- NPS (latest score + trend)
- Customer Health Score (% of customers in each health tier)

**Product Dashboard (Daily Review):**
- Feature Adoption Rates (lead scoring, proposals, battle cards, conversation intel)
- AI Performance Metrics (lead scoring accuracy, proposal acceptance rate)
- Actions Per User Per Week (segmented by top/middle/bottom quartile)
- Error rates (API errors, AI timeouts)

**Sales Dashboard (Weekly Review):**
- New customers this week
- MRR added this week
- Pipeline (opportunities using AI vs. not using AI)
- Win rate comparison (AI users vs. non-AI users)

**Customer Success Dashboard (Daily Review):**
- Customer Health Scores (flagged at-risk customers)
- WAU by customer (identify customers with declining usage)
- NPS Detractors (follow-up required)
- Support tickets (open vs. closed)

---

## Metric Ownership

| Metric | Owner | Review Cadence | Reporting Tool |
|--------|-------|----------------|----------------|
| **Revenue Influenced by AI** | CEO | Weekly | Salesforce + Custom Dashboard |
| **MRR / ARR** | CFO | Weekly | Stripe Dashboard |
| **WAU / Feature Adoption** | VP Product | Daily | Mixpanel |
| **AI Performance Metrics** | Head of AI | Weekly | Custom Dashboard |
| **Sales Cycle / Win Rate** | VP Sales | Weekly | Salesforce Reports |
| **NPS / Customer Health** | VP Customer Success | Weekly | Delighted (NPS) + Custom Dashboard |
| **LTV:CAC / Payback Period** | CFO | Monthly | Excel/Google Sheets |
| **Net Revenue Retention** | CFO | Quarterly | Stripe + Salesforce |

---

**Document Owner:** Product & Analytics
**Last Updated:** November 2024
**Review Cycle:** Quarterly (metrics framework may evolve as we learn)
