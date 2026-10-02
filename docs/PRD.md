# Product Requirements Document (PRD)
## Checkpoint by SIP Guardian

**Version:** 1.0  
**Last Updated:** October 2, 2026  
**Status:** MVP Phase 1 - Shadow Mode Testing  
**Document Owner:** Product Team

---

## Executive Summary

**Checkpoint by SIP Guardian** is an AI-powered intervention system that helps investors make informed decisions at the critical moment when they attempt to pause, reduce, or cancel their Systematic Investment Plan (SIP). The product combines transparent impact calculations with simple AI explanations to ensure users understand the consequences of their actions without removing their freedom of choice.

### Product Vision
SIP Guardian is an AI-powered co-pilot for long-term investors. **Checkpoint** is the core intervention feature that prevents uninformed decisions at critical financial moments.

### MVP Scope (Phase 1)
A focused intervention screen triggered when users attempt SIP changes, providing:
- Clear impact visualization (before/after comparison)
- AI-powered explanations of verified calculations
- Alternative suggestions without pressure
- Shadow mode analytics for validation

---

## 1. Product Positioning

### 1.1 Overall Strategy
- **Product Name:** Checkpoint by SIP Guardian
- **Tagline:** "Because every investment decision deserves informed consideration"
- **Primary Use Case:** SIP pause/reduce/cancel intervention (Phase 1)
- **Future Vision:** Full AI co-pilot for comprehensive financial decision-making

### 1.2 What This Is
✅ Intervention system at SIP change confirmation moments  
✅ Transparent calculation engine + AI explanation layer  
✅ Alternative suggestion engine without bias  
✅ Shadow mode testing platform for hypothesis validation  

### 1.3 What This Is NOT (Yet)
❌ Live broker integration (Phase 1 is standalone)  
❌ Investment advisory service  
❌ Automated decision-maker  
❌ Full financial planning platform  

### 1.4 Competitive Differentiation
- **vs. Traditional Brokers:** We explain consequences; they just execute
- **vs. Robo-Advisors:** We educate; they recommend
- **vs. Financial Advisors:** We're instant and scalable; they're expensive and slow
- **Unique Value:** AI explanations of verified calculations with zero pressure

---

## 2. Problem Statement

### 2.1 Validated Evidence

**Industry Data:**
- SIP discontinuation rates in India: 40-60% don't complete tenure (SEBI/AMFI reports)
- Emotional decisions during market downturns lead to wealth destruction
- Most investors lack understanding of compounding impact

**Evidence Labels:**
- 📊 **Verified:** SIP closure rates from industry reports
- 📈 **Observed:** Correlation between market downturns and SIP cancellations
- 💡 **Hypothesis:** Intervention + education = better outcomes

### 2.2 Unknowns We're Testing

❓ **Unknown #1:** Number of actionable SIP-change attempts  
*How many people reach the confirmation screen and could benefit?*

❓ **Unknown #2:** Percentage who would change their decision  
*Does showing impact actually influence behavior?*

❓ **Unknown #3:** Long-term outcome validation  
*Do "informed" decisions correlate with better 30/90-day SIP behavior?*

❓ **Unknown #4:** Optimal intervention design  
*What information density prevents decision paralysis?*

### 2.3 Hypothesis

> **"At the moment of SIP change, showing clear impact projections + simple AI explanations + pressure-free alternatives will lead to more informed decisions and potentially better long-term financial outcomes."**

**Testing Approach:** Shadow mode with control group comparison

---

## 3. Target Users

### 3.1 Primary Persona: "Struggling Saver"

**Demographics:**
- Age: 25-40
- Income: ₹5-15 LPA
- Investment Experience: Beginner to Intermediate
- Tech Comfort: High (uses mobile apps)

**Behavior:**
- Active SIP investor for 1-3 years
- Portfolio value: ₹50K-₹5L
- Facing temporary cash crunch
- Emotional during market volatility

**Pain Points:**
- Doesn't understand long-term impact of stopping SIP
- Makes impulsive decisions during market downturns
- Lacks financial literacy about compounding
- No trusted advisor for quick guidance

**Jobs to Be Done:**
- Understand consequences before making irreversible decisions
- Explore alternatives without judgment
- Make informed choice quickly (< 2 minutes)
- Preserve financial goals despite short-term pressure

### 3.2 Secondary Persona: "Goal-Oriented Planner"

**Demographics:**
- Age: 30-45
- Income: ₹15-40 LPA
- Investment Experience: Intermediate to Advanced
- Planning Horizon: 5-20 years

**Behavior:**
- Multiple active SIPs
- Clear financial goals (retirement, education, house)
- Analytical decision-maker
- Wants data-driven insights

**Pain Points:**
- Needs quick impact analysis
- Wants to see goal-specific projections
- Prefers transparency over recommendations
- Values autonomy in decision-making

---

## 4. Core Features

### 4.1 Feature: SIP Change Interception ✅ MVP

**User Flow:**
1. User attempts to Pause/Reduce/Cancel SIP on broker platform
2. Before final confirmation, Checkpoint screen appears
3. User reviews impact, AI explanation, alternatives
4. User confirms original action, selects alternative, or cancels

**Technical Requirements:**
- Trigger: SIP change confirmation moment
- Response Time: < 2 seconds to load
- Data Required: SIP details, current value, goal information
- Output: CheckpointData object with calculations + explanations

**Success Criteria:**
- 90% of users see the screen (< 10% errors)
- < 30% users immediately close without reading
- < 5 second load time for full screen

### 4.2 Feature: Impact Visualization ✅ MVP

**Components:**

**A. Side-by-Side Comparison**
- Current Path: Original projection if SIP continues
- After Change: Projected outcome after pause/reduce/cancel
- Visual Design: Green (good) vs Red (warning) cards

**B. Key Metrics Display**
- Final Amount (₹)
- Total Investment (₹)
- Estimated Returns (₹)
- Time to Goal (years/months)
- Goal Progress Bars (%)

**C. Difference Highlights**
- Lost Investment amount
- Lost Returns amount
- Time Delay
- Power of Compounding loss

**Technical Implementation:**
- Component: `ImpactVisualization.tsx`
- Calculations: From deterministic engine
- Responsive: Mobile-first design
- Accessibility: WCAG 2.1 AA compliant

**Success Criteria:**
- > 80% users scroll to view full comparison
- < 3 seconds to comprehend main impact
- Positive user feedback on clarity

### 4.3 Feature: Deterministic Calculation Engine ✅ MVP

**Purpose:** Generate accurate, transparent SIP projections

**Formula:**
```
FV = P × [(1 + r)^n - 1] / r × (1 + r)
Where:
- P = Monthly investment
- r = Monthly return rate
- n = Number of months
```

**Calculation Types:**
1. **Continue Scenario:** Current SIP continues until goal date
2. **Cancel Scenario:** No new investments, existing grows with market
3. **Pause Scenario:** Zero investment for X months, then resume
4. **Reduce Scenario:** Lower monthly amount continues

**Assumptions:**
- Expected Return: 12% (equity) / 8% (debt) - configurable
- Inflation: 6% for real returns calculation
- Market Scenario: Moderate (conservative/optimistic options)

**Methodology Transparency:**
- Formula displayed in UI (expandable section)
- Assumptions clearly stated
- "View Calculation Method" toggle
- No hidden adjustments

**Technical Requirements:**
- Module: `lib/calculator.ts`
- Pure functions (no side effects)
- Unit tested for accuracy
- No AI involvement in calculations

**Success Criteria:**
- 100% calculation accuracy (verified against Excel)
- < 100ms computation time
- Zero numerical errors in production

### 4.4 Feature: AI Explanation Layer ✅ MVP

**Purpose:** Translate complex calculations into simple language

**What AI Does:**
- Explains what the numbers mean
- Highlights key points to understand
- Identifies risk factors
- Provides context about compounding

**What AI Does NOT Do:**
- Generate projection numbers
- Make investment recommendations
- Tell users what to do
- Predict actual market returns

**Implementation:**
- API: `/api/ai-explain`
- Providers: OpenAI GPT-4 or Anthropic Claude
- Fallback: Template-based explanations
- Context: SIP details + verified calculations

**Output Structure:**
```typescript
{
  summary: string;              // 2-3 sentence overview
  keyPoints: string[];          // 3-4 bullet points
  riskFactors: string[];        // 2-3 considerations
  detailedExplanation: string;  // 150-200 words
  confidence: 'high' | 'medium' | 'low';
}
```

**Prompt Engineering Guidelines:**
- Empathetic, non-judgmental tone
- Simple language (8th-grade reading level)
- Focus on education, not advice
- Transparent about uncertainties
- Never use phrases like "you should" or "we recommend"

**Success Criteria:**
- > 70% users expand AI explanation
- < 5% negative feedback on tone/clarity
- 100% uptime with template fallback

### 4.5 Feature: Alternative Suggestions ✅ MVP

**Purpose:** Provide options without pressure or bias

**Alternatives Generated:**

**1. Reduce Amount (if action = cancel)**
- Suggestion: Cut to 50% instead of stopping
- Impact: Lower shortfall than full cancellation
- Pros: Maintain discipline, keep compounding active
- Cons: Still requires commitment

**2. Pause Temporarily (if action = cancel)**
- Suggestion: 3-6 month pause with auto-resume
- Impact: Miss some months but preserve most gains
- Pros: Zero cash flow for pause period
- Cons: Misses market averaging opportunity

**3. Emergency Fund Approach**
- Suggestion: Build separate liquid fund
- Impact: Keep SIP active, add emergency corpus
- Pros: No goal impact
- Cons: Requires additional allocation

**Design Principles:**
- **No Auto-Highlighting:** User chooses freely
- **Balanced Presentation:** Show both pros and cons
- **Clear Impact:** Show projected outcome for each
- **Easy Opt-Out:** Original action always accessible

**Technical Implementation:**
- Function: `generateAlternatives()` in calculator
- Component: `AlternativesSection.tsx`
- Selection: Optional, never required
- Tracking: Analytics captures selection rate

**Success Criteria:**
- > 50% users review at least one alternative
- 10-30% select alternative over original action
- No user feedback about "pressure" or "manipulation"

### 4.6 Feature: Shadow Mode Analytics ✅ MVP

**Purpose:** Validate hypotheses without affecting real transactions

**Data Collection:**

**Event Tracking:**
- `checkpoint_shown`: When screen loads
- `action_confirmed`: User proceeds with choice
- `action_cancelled`: User goes back
- `alternative_selected`: User chooses alternative
- `info_expanded`: User views calculation details

**Session Metrics:**
- Start/end timestamps
- Original action vs final action
- Time spent on screen
- Alternative viewed (yes/no)
- Informed decision flag (>15s spent)
- User friction level (low/medium/high)

**Aggregated Metrics:**
- Total sessions
- Informed decision rate
- Average time spent
- Cancellation rate
- Alternative selection rate
- Action change rate
- Friction distribution

**Technical Implementation:**
- API Endpoints:
  - `/api/analytics/track` - Event logging
  - `/api/analytics/session` - Session completion
- Module: `lib/analytics.ts`
- Storage: In-memory (demo) → Database (production)
- Privacy: Anonymized user IDs, no PII

**Dashboard:** `/dashboard`
- Real-time metrics display
- Stop/Go criteria evaluation
- Session history table
- CSV export functionality

**Success Criteria:**
- 100% event capture rate
- < 100ms analytics overhead
- Zero PII leakage

---

## 5. User Experience

### 5.1 Prototype Screen Flow

**Screen 1: Checkpoint Header**
```
⚠️ Before you [cancel/pause/reduce] your SIP

Effective date: [Tomorrow's date]

We've calculated how this change will impact your [Goal Name] goal.
Please review the information below.

[Go Back] button always visible
```

**Screen 2: Impact Visualization**
```
┌─────────────────────────────┬─────────────────────────────┐
│ ✅ Current Path              │ ⚠️ After [Action]            │
│                             │                             │
│ Final Amount: ₹50,00,000    │ Final Amount: ₹35,00,000    │
│ Investment: ₹25,00,000      │ Investment: ₹15,00,000      │
│ Returns: ₹25,00,000         │ Returns: ₹20,00,000         │
│ Time to Goal: 15 years      │ Time to Goal: ∞ (unreachable)│
│                             │                             │
│ Progress: [████████] 100%   │ Progress: [█████░] 70%      │
└─────────────────────────────┴─────────────────────────────┘

Goal Shortfall: ₹15,00,000 (₹50L goal - ₹35L projected)
```

**Screen 3: AI Explanation**
```
🤖 AI Explanation (High Confidence)

"By stopping your SIP, you could miss out on approximately
₹15,00,000 in wealth creation. This is because you'll lose
the power of compounding—where your returns generate their
own returns over time..."

💡 Key Points:
• You'll have 30% less wealth at the end
• Majority of loss comes from missed compounding
• Goal may be unattainable without significant catch-up

⚠️ Risk Factors:
• Market volatility may change projections
• Inflation will reduce purchasing power
• Behavioral risk of not restarting SIP

[Show Calculation Details ▼]
```

**Screen 4: Alternatives**
```
Consider These Alternatives

[Option 1: Reduce to ₹5,000/month]
Instead of stopping completely, continue at lower amount
Final Amount: ₹42,00,000 | Shortfall: ₹8,00,000
✓ Maintains discipline  ✓ Keeps compounding active
✗ Still requires ₹5K/month

[Option 2: Pause for 6 months]
Take a break and resume automatically
Final Amount: ₹47,00,000 | Shortfall: ₹3,00,000
✓ Zero investment for 6 months  ✓ Auto-resume
✗ Misses 6 months of market averaging

[Option 3: Build Emergency Fund Separately]
Keep SIP active while building safety net
Final Amount: ₹50,00,000 | Shortfall: ₹0
✓ No impact on goals  ✓ Separate emergency cushion
✗ Requires additional monthly allocation
```

**Screen 5: Disclaimer & Actions**
```
⚠️ Important Disclaimer
All projections are based on assumptions and historical
averages. Actual market returns may vary. This is not
investment advice. Past performance does not guarantee
future results. Please consult with a financial advisor
for personalized guidance.

[Go Back]  [Confirm Cancel SIP] ← Original action always available
```

### 5.2 Interaction Principles

**1. No Dark Patterns:**
- Original action never hidden or obscured
- No "recommended" badges on alternatives
- Equal visual weight for all options
- No countdown timers or artificial urgency

**2. Progressive Disclosure:**
- Summary visible by default
- Details expandable on demand
- Calculation methodology optional view
- Users control information depth

**3. Respectful Tone:**
- "We've calculated..." not "You're making a mistake"
- "Consider these alternatives" not "You should do this instead"
- "Your choice" emphasized throughout

**4. Fast & Efficient:**
- Target: 30-60 seconds to review
- No required reading before proceeding
- Mobile-optimized for quick decisions

### 5.3 Visual Storytelling

**Color Psychology:**
- 🟢 Green: Current path (positive framing)
- 🔴 Red/Amber: Warning about change (informational, not judgmental)
- 🔵 Blue: Alternatives (neutral, exploratory)
- 🟣 Purple: AI section (distinct, tech-forward)

**Typography:**
- Large numbers for key amounts (2-3rem)
- Clear hierarchy (H1 > H2 > body)
- Readable fonts (Inter, system sans-serif)
- High contrast (WCAG AA minimum)

**Iconography:**
- ⚠️ Warning (informational)
- ✅ Success/positive
- 🤖 AI assistance
- 💡 Key insights
- 🎯 Goal-related
- ⏱️ Time-related

---

## 6. Technical Architecture

### 6.1 Tech Stack

**Frontend:**
- Framework: Next.js 16 (App Router)
- Language: TypeScript 5+
- Styling: Tailwind CSS 3+
- State: React Hooks
- Components: Custom (no UI library dependency)

**Backend:**
- Runtime: Node.js 18+ (Next.js API Routes)
- AI: OpenAI GPT-4 / Anthropic Claude
- Database: PostgreSQL (production) / In-memory (MVP)
- Analytics: Custom tracking system

**Deployment:**
- Platform: Vercel
- CDN: Vercel Edge Network
- Functions: Edge Functions (AI explanation)
- Monitoring: Vercel Analytics

### 6.2 Data Flow

```
User Triggers SIP Change
         ↓
[Broker Platform] (Future)
         ↓
Checkpoint Intercepted
         ↓
Load SIP Details
         ↓
┌────────────────────────────┐
│ Deterministic Calculator    │ ← Pure functions, no AI
│ - Calculate current path    │
│ - Calculate impact path     │
│ - Generate alternatives     │
└────────────────────────────┘
         ↓
┌────────────────────────────┐
│ AI Explanation Generator    │ ← Async, non-blocking
│ - Send calculations to AI   │
│ - Get simple explanation    │
│ - Fallback to templates     │
└────────────────────────────┘
         ↓
Render Checkpoint Screen
         ↓
User Reviews & Decides
         ↓
Track Analytics Event
         ↓
[Execute Action] (Future integration)
```

### 6.3 API Specifications

**POST /api/ai-explain**
```typescript
Request: {
  sipDetails: SIPDetails;
  action: SIPAction;
  impactCalculation: ImpactCalculation;
}

Response: {
  summary: string;
  keyPoints: string[];
  riskFactors: string[];
  detailedExplanation: string;
  confidence: 'high' | 'medium' | 'low';
}
```

**POST /api/analytics/track**
```typescript
Request: {
  eventId: string;
  eventType: 'checkpoint_shown' | 'action_confirmed' | ...;
  userId: string;
  sessionId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

Response: {
  success: boolean;
  eventId: string;
}
```

**POST /api/analytics/session**
```typescript
Request: SessionMetrics

Response: {
  success: boolean;
  sessionId: string;
}
```

### 6.4 Performance Requirements

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Initial Load | < 2s | < 5s |
| Calculation Time | < 100ms | < 500ms |
| AI Explanation | < 3s | < 10s (then fallback) |
| Analytics Overhead | < 100ms | < 500ms |
| Mobile Performance | Lighthouse > 90 | > 70 |

### 6.5 Security & Privacy

**Data Handling:**
- No PII storage without consent
- Anonymized user IDs
- Encrypted API communications (HTTPS only)
- No sensitive financial data logged

**AI Security:**
- API keys in environment variables
- Rate limiting on AI endpoints
- Input sanitization
- Output validation

**Compliance:**
- GDPR: Right to deletion, data portability
- CCPA: Do not sell data
- India: IT Act 2000, RBI guidelines

---

## 7. Success Metrics & Validation

### 7.1 Primary Success Metrics

**Metric 1: Informed Decision Rate**
- **Definition:** % of users who spend ≥15 seconds reviewing impact
- **Target:** > 60%
- **Measurement:** Session analytics
- **Why It Matters:** Validates users engage with content

**Metric 2: Calculation Accuracy**
- **Definition:** Mathematical correctness of projections
- **Target:** 100%
- **Measurement:** Automated tests vs Excel
- **Why It Matters:** Foundation of trust

**Metric 3: Completion Time**
- **Definition:** Average time from load to decision
- **Target:** 30-60 seconds
- **Measurement:** Session metrics
- **Why It Matters:** Balance thoroughness with friction

**Metric 4: User Friction**
- **Definition:** Distribution of low/medium/high friction
- **Target:** > 60% low friction
- **Measurement:** Time-based heuristic
- **Why It Matters:** User experience quality

### 7.2 Secondary Success Metrics

**Metric 5: 30/90-Day SIP Outcomes**
- **Definition:** Did users restart? Change again? (vs control group)
- **Target:** TBD (establish baseline first)
- **Measurement:** Broker integration data
- **Why It Matters:** Long-term behavior validation

**Metric 6: Alternative Selection Rate**
- **Definition:** % choosing suggested alternative over original
- **Target:** 10-30%
- **Measurement:** Session analytics
- **Why It Matters:** Value of suggestions

**Metric 7: Retention Comparison**
- **Definition:** Checkpoint users vs control group SIP continuation
- **Target:** Positive difference
- **Measurement:** Cohort analysis
- **Why It Matters:** Business impact validation

### 7.3 Stop/Go Criteria

**Continue Development If:**
✅ Informed decision rate > 60%  
✅ Average friction time < 30 seconds  
✅ Drop-off rate < 30%  
✅ Positive user feedback (NPS > 40)  

**Stop/Modify If:**
🛑 Users ignore Checkpoint completely (< 30% engagement)  
🛑 High drop-off rate (> 70% close without reading)  
🛑 Negative feedback about complexity or manipulation  
🛑 No behavioral difference vs control group  

**Evaluation Timeline:**
- Week 1-2: Technical validation (accuracy, performance)
- Week 3-4: UX validation (engagement, friction)
- Month 2-3: Behavioral validation (outcomes)
- Month 3: Go/No-Go decision for Phase 2

---

## 8. Regulatory & Compliance

### 8.1 Current Safeguards ✅

**Transparency:**
- ✅ Calculation methodology visible
- ✅ Assumptions clearly stated
- ✅ "Based on historical averages" disclaimers
- ✅ "Actual returns may vary" warnings

**Choice Preservation:**
- ✅ Original action always accessible
- ✅ No blocking or delayed confirms
- ✅ No "recommended" option highlighting
- ✅ Go Back button prominent

**Honest Communication:**
- ✅ "This is not investment advice" disclaimer
- ✅ "Past performance ≠ future results" notice
- ✅ "Consult a financial advisor" suggestion
- ✅ Empathetic, non-judgmental tone

### 8.2 Required Before Live Deployment 🔲

**SEBI Compliance Review**
- Investment advisory registration status
- Whether Checkpoint constitutes "advice"
- Disclosure requirements
- Record-keeping obligations

**Legal Review**
- Terms of service
- Liability disclaimers
- User consent mechanisms
- Data protection compliance

**Broker Integration Agreements**
- Partnership terms
- Data sharing protocols
- Revenue sharing (if applicable)
- Technical integration standards

**Data Privacy Compliance**
- GDPR (if EU users)
- India Data Protection laws
- User consent flows
- Right to deletion implementation

### 8.3 Risk Mitigation

**Risk: Misinterpreted as Investment Advice**
- Mitigation: Clear disclaimers, "information only" framing
- Monitoring: User feedback analysis

**Risk: Over-reliance on AI Explanations**
- Mitigation: "AI explains verified calculations" messaging
- Monitoring: Confidence level tracking

**Risk: Calculation Errors**
- Mitigation: Automated testing, manual QA
- Monitoring: Error logging, user reports

**Risk: Regulatory Classification Change**
- Mitigation: Legal monitoring, adaptive compliance
- Monitoring: Regulatory update tracking

---

## 9. Roadmap

### Phase 1: MVP (Q1 2027) ✅ Current
**Goal:** Validate core hypothesis with shadow mode testing

**Deliverables:**
- ✅ SIP intervention screen (Cancel/Pause/Reduce)
- ✅ Deterministic calculation engine
- ✅ AI explanation API (OpenAI + Anthropic)
- ✅ Alternative suggestion logic
- ✅ Shadow mode analytics system
- ✅ Success metrics dashboard
- 🔄 User testing (10-50 users)

**Success Criteria:**
- Technical: All features functional, < 5% error rate
- UX: > 60% informed decision rate, < 30s friction
- Business: Stop/Go criteria met

### Phase 2: Validation (Q2 2027)
**Goal:** Real-world testing with broker integration

**Deliverables:**
- [ ] 1-2 broker partnerships
- [ ] Live transaction integration
- [ ] Expanded alternative logic (personalization)
- [ ] A/B testing framework
- [ ] User feedback collection
- [ ] Refined UX based on Phase 1 learnings

**Success Criteria:**
- Integration: < 2% transaction failures
- Engagement: Maintain > 60% informed decision rate at scale
- Behavior: Positive 30/90-day outcomes vs control

### Phase 3: Scale (Q3 2027)
**Goal:** Multi-broker rollout and feature expansion

**Deliverables:**
- [ ] 5+ broker integrations
- [ ] Personalized AI co-pilot
- [ ] Other financial moments (loan EMI, credit card, insurance)
- [ ] Portfolio-level insights
- [ ] Mobile app (if needed)

**Success Criteria:**
- Scale: 10,000+ monthly active users
- Quality: Maintain Phase 2 metrics
- Revenue: Pilot monetization model

### Phase 4: Platform (Q4 2027+)
**Goal:** Full SIP Guardian ecosystem

**Deliverables:**
- [ ] API for third-party platforms
- [ ] Advanced AI features (predictive, proactive)
- [ ] Financial wellness scoring
- [ ] Community features
- [ ] SaaS monetization (B2B)

**Success Criteria:**
- Platform: 50,000+ MAU
- Business: Revenue positive
- Impact: Measurable improvement in user financial health

---

## 10. Business Model

### 10.1 Phase 1 (MVP): Free / Validation
- **Revenue:** $0
- **Goal:** Prove product-market fit
- **Users:** Beta testers, early adopters
- **Funding:** Bootstrapped / Grant / Pre-seed

### 10.2 Phase 2-3: Partnership Model
- **Revenue:** Broker partnerships (SaaS fee or rev share)
- **Pricing:** ₹10-50 per intervention (estimated)
- **Value Prop:** Reduced SIP churn = higher AUM retention
- **Target:** 5-10 broker partnerships

### 10.3 Phase 4: Platform Model
**B2C:**
- Freemium: Basic checkpoint free
- Premium: ₹99-299/month for full co-pilot
- Features: Comprehensive financial guidance

**B2B:**
- API access: ₹50,000-₹5,00,000/month
- White-label: Custom pricing
- Customers: Brokers, fintechs, banks

### 10.4 Unit Economics (Projected)

**Assumptions:**
- Broker saves ₹1000 in AUM per prevented SIP cancellation
- 30% of interventions prevent cancellation
- Broker willing to pay 10% of savings

**Calculation:**
- Value per intervention: ₹1000 × 30% = ₹300
- Our fee: ₹300 × 10% = ₹30
- At 10,000 interventions/month: ₹3,00,000 revenue
- At scale (100K interventions): ₹30,00,000/month

**Note:** These are projections requiring validation

---

## 11. Open Questions & Risks

### 11.1 Open Questions

**Q1: Regulatory Classification**
- Is Checkpoint classified as investment advice under SEBI?
- What registration/compliance is required?
- Timeline and cost for compliance?

**Q2: Behavioral Persistence**
- Do informed decisions lead to better long-term outcomes?
- How long do intervention effects last?
- Do users build financial literacy over time?

**Q3: Optimal Information Density**
- How much information is "too much"?
- Which metrics matter most to users?
- Does AI explanation add value or noise?

**Q4: Monetization Feasibility**
- Will brokers pay for intervention service?
- What's the right pricing model?
- Can we achieve profitability at scale?

### 11.2 Known Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Regulatory block | Medium | Critical | Early legal review, adaptive design |
| Low user engagement | Low | High | UX testing, iterative refinement |
| Calculation errors | Low | Critical | Automated testing, manual QA |
| AI quality issues | Medium | Medium | Template fallback, human review |
| Broker resistance | Medium | High | Value proof, pilot partnerships |
| Data privacy breach | Low | Critical | Security audit, encryption |

### 11.3 Dependencies

**External:**
- AI API availability (OpenAI/Anthropic)
- Broker partnership willingness
- Regulatory approval timeline
- Market conditions (user behavior)

**Internal:**
- Team capacity (eng, design, product)
- Funding runway
- User acquisition channels
- Technical infrastructure

---

## 12. Team & Resources

### 12.1 Core Team (MVP)

**Product:** 1 PM
- PRD ownership
- User research
- Roadmap planning

**Engineering:** 2 Engineers
- Full-stack development (Next.js)
- API integrations
- Analytics implementation

**Design:** 1 Designer
- UX/UI design
- User testing
- Visual design

**Total:** 4 people for Phase 1

### 12.2 Phase 2 Expansion

- +1 Backend Engineer (integrations)
- +1 Data Analyst (metrics)
- +0.5 Legal/Compliance
- Total: 6.5 people

### 12.3 Budget Estimate (MVP)

| Item | Cost (₹) |
|------|---------|
| Team (3 months) | 15,00,000 |
| AI API costs | 50,000 |
| Infrastructure | 30,000 |
| Legal review | 2,00,000 |
| User testing | 50,000 |
| **Total** | **18,30,000** |

---

## 13. Appendix

### 13.1 Glossary

- **SIP:** Systematic Investment Plan
- **AUM:** Assets Under Management
- **SEBI:** Securities and Exchange Board of India
- **MAU:** Monthly Active Users
- **Shadow Mode:** Testing without affecting real transactions
- **Stop/Go Criteria:** Metrics determining project continuation

### 13.2 References

- SEBI/AMFI Industry Reports on SIP Discontinuation
- Behavioral Finance Research (Kahneman, Thaler)
- Compounding Mathematics (Finance textbooks)
- UX Best Practices (Nielsen Norman Group)
- AI Ethics Guidelines (Partnership on AI)

### 13.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-09-15 | Initial team | First draft |
| 0.5 | 2026-09-28 | Product team | Incorporated feedback |
| 1.0 | 2026-10-02 | Final review | MVP PRD approved |

---

## 14. Approval & Sign-off

**Product Lead:** _________________ Date: _______

**Engineering Lead:** _________________ Date: _______

**Design Lead:** _________________ Date: _______

**Legal Review:** _________________ Date: _______

---

**Document Status:** ✅ Approved for MVP Development

**Next Review:** After Phase 1 completion (Q1 2027 end)

---

*This PRD is a living document. It will be updated as we learn from users, validate hypotheses, and iterate on the product. Feedback and suggestions welcome at product@sipguardian.com*
