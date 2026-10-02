# Checkpoint by SIP Guardian

> Smart intervention system helping investors understand the consequences of SIP changes and make informed decisions

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Product Vision

**Checkpoint** is the core intervention feature of SIP Guardian that appears at the critical moment when an investor attempts to pause, reduce, or cancel their Systematic Investment Plan (SIP). The product helps investors understand the true consequences of changing their SIP and compare available alternatives—all presented with clear impact projections, AI-powered explanations, and zero pressure.

## 📋 Table of Contents

- [Product Positioning](#product-positioning)
- [MVP Scope - Phase 1](#mvp-scope---phase-1)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Regulatory Compliance](#regulatory-compliance)
- [Success Metrics](#success-metrics)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## 🎨 Product Positioning

**Checkpoint by SIP Guardian** positions itself as:
- **Overall Product Vision**: SIP Guardian - An AI-powered co-pilot for long-term investors
- **Core Feature**: Checkpoint - The intervention moment that prevents uninformed SIP changes
- **Value Proposition**: Help investors understand consequences and compare alternatives before making irreversible decisions

### What This Is
- A focused intervention system triggered at SIP pause/reduce/cancel moments
- Transparent impact calculator with AI-powered simple-language explanations
- Alternative suggestion engine without bias or pressure

### What This Is NOT (Yet)
- Not a full-featured investment platform
- Not integrated with actual brokers (Phase 1 is standalone/shadow mode)
- Not making decisions for users—always preserving freedom of choice

## 🚀 MVP Scope - Phase 1

### In Scope
✅ **SIP Change Interception** - Pause, Reduce, Cancel confirmation screen  
✅ **Impact Calculation** - Deterministic engine for projecting SIP change effects  
✅ **AI Explanations** - Simple language breakdown of complex financial math  
✅ **Alternative Suggestions** - Smart options without auto-highlighting  
✅ **Shadow Mode Testing** - Track metrics without affecting real transactions  
✅ **Compliance Framework** - Disclaimers, choice preservation, regulatory considerations

### Out of Scope (Future Phases)
❌ Live broker integrations  
❌ Full AI co-pilot features  
❌ Other financial decision moments (home loans, credit cards, etc.)  
❌ Historical market recovery claims (unless backed by transparent methodology)  
❌ Automatic SIP restart/optimization

## 🔍 Problem Statement

**Validated Evidence:**
- SIP discontinuation rates in India are concerning (industry reports indicate 40-60% of SIPs don't complete their tenure)
- Many investors stop SIPs during market downturns without understanding compounding loss
- Emotional decision-making during market volatility leads to poor long-term outcomes

**Unknowns We're Testing:**
- ❓ How many SIP change attempts are truly "actionable" intervention moments
- ❓ What percentage of users would benefit from seeing impact projections
- ❓ Whether showing alternatives actually changes user behavior
- ❓ If informed decisions correlate with better 30/90-day outcomes

**Hypothesis:**
At the moment of SIP change, showing clear impact projections + simple AI explanations + pressure-free alternatives will lead to more informed decisions and potentially better long-term outcomes.

## ✨ Features

### 1. Impact Visualization
- **Side-by-side comparison** of current path vs. after change
- **Clear metrics**: Final amount, shortfall, time delay, lost compounding
- **Goal progress bars** showing visual impact
- **Transparent calculations** with view-able methodology

### 2. AI Explanation Layer
- **Simple language** breakdown of financial projections
- **Key points** highlighting what matters most
- **Risk factors** to consider
- **Confidence levels** for AI explanations
- **Important**: AI explains verified calculations; it doesn't generate numbers

### 3. Deterministic Calculation Engine
- **Compound interest formula**: FV = P × [(1 + r)^n - 1] / r × (1 + r)
- **Market assumptions**: Based on fund type (equity @ 12%, debt @ 8%)
- **Transparent methodology**: Users can see exactly how projections are made
- **No AI in calculations**: Pure mathematical projections

### 4. Alternative Suggestions
- **Multiple options**: Reduce amount, pause temporarily, emergency fund approach
- **Pros & cons** for each alternative
- **No auto-highlighting**: User chooses freely
- **Clear impact** for each alternative

### 5. Compliance & Safety
- Clear disclaimers about projection uncertainties
- "No pressure" messaging throughout
- Easy access to original action (never blocked)
- Regulatory review requirement flagged

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Backend (API Routes)
- **Runtime**: Node.js via Next.js API routes
- **AI Integration**: OpenAI GPT-4 / Anthropic Claude (configurable)
- **Database**: TBD for analytics (PostgreSQL recommended)

### Deployment
- **Platform**: Vercel
- **Edge Functions**: For AI explanation generation
- **Analytics**: Shadow mode tracking

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/checkpoint-sip-guardian.git
cd checkpoint-sip-guardian
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here

NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_SHADOW_MODE=true
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Try the Demo
- Go to `/checkpoint` to see the intervention screen
- Select different actions (Cancel, Pause, Reduce)
- See real-time impact calculations
- Test AI explanations (requires API key)

## 📁 Project Structure

```
checkpoint-sip-guardian/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── checkpoint/
│   │   └── page.tsx             # Demo checkpoint screen
│   ├── api/
│   │   └── ai-explain/          # AI explanation endpoint
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── CheckpointScreen.tsx     # Main intervention screen
│   ├── ImpactVisualization.tsx  # Impact comparison component
│   ├── AIExplanationPanel.tsx   # AI explanation UI
│   └── AlternativesSection.tsx  # Alternative options
├── lib/
│   └── calculator.ts            # Deterministic calculation engine
├── types/
│   └── index.ts                 # TypeScript interfaces
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## ⚙️ How It Works

### 1. User Triggers SIP Change
```
User attempts to: Pause | Reduce | Cancel SIP
              ↓
    Checkpoint Intercepts
              ↓
    Show Intervention Screen
```

### 2. Calculation Flow
```typescript
// Deterministic calculation (no AI)
const impact = calculateSIPImpact(sipDetails, action, newAmount, pauseDuration);

// Generates:
// - Original projection (if continued)
// - Impact projection (after change)
// - Shortfall amount
// - Time delay
// - Lost compounding
```

### 3. AI Explanation Flow
```typescript
// AI explains the numbers (async)
const explanation = await fetch('/api/ai-explain', {
  sipDetails,
  action,
  impactCalculation  // Verified numbers from step 2
});

// AI returns:
// - Simple language summary
// - Key points
// - Risk factors
// - Detailed explanation
```

### 4. User Decision
```
User sees:
- Clear impact visualization
- AI explanation
- Alternative options
- No pressure messaging
          ↓
User chooses:
- Confirm original action
- Select alternative
- Go back and reconsider
```

## ⚖️ Regulatory Compliance

### Current Safeguards
- ✅ Clear disclaimers about projection uncertainties
- ✅ "Past performance doesn't guarantee future results" messaging
- ✅ All choices remain accessible (no blocking)
- ✅ Avoid pressure tactics or highlighted "recommended" options
- ✅ Transparent calculation methodology

### Required Before Live Deployment
- 🔲 **SEBI Compliance Review**: Investment advisory regulations
- 🔲 **Legal Review**: Terms of service, user disclosures
- 🔲 **Data Privacy**: User data handling, GDPR/local laws
- 🔲 **Broker Integration Agreements**: If partnering with platforms
- 🔲 **Liability Framework**: Clarify we're informational, not advisory

**Important**: This MVP is for shadow mode testing only. Do NOT deploy to live users without proper regulatory review and approvals.

## 📊 Success Metrics

### Primary Metrics (Measured in Shadow Mode)
1. **Informed Decision Rate**: % of users who view impact + explanations before deciding
2. **Calculation Accuracy**: Verification of projection formulas
3. **Completion Time**: Average time spent on Checkpoint screen
4. **User Friction**: Drop-off rates, confusion signals

### Secondary Metrics
5. **30/90-Day SIP Outcomes**: Did users restart? Change again? (vs. control group)
6. **Alternative Selection Rate**: % choosing suggested alternatives
7. **Retention Comparison**: Checkpoint users vs. control group

### Stop/Go Criteria
**Continue if:**
- >60% users engage with impact visualization
- <30 seconds average friction time
- Positive sentiment in user feedback

**Stop/Modify if:**
- Users ignore Checkpoint completely
- High drop-off rates (>70%)
- Negative feedback about complexity or confusion

## 🗺 Roadmap

### Phase 1: MVP (Current - Q1 2027)
- ✅ SIP intervention screen
- ✅ Impact calculator + AI explanations
- ✅ Alternative suggestions
- 🔄 Shadow mode testing
- 🔄 Metrics dashboard

### Phase 2: Validation (Q2 2027)
- [ ] Real broker integration (1-2 partners)
- [ ] Expanded alternative logic
- [ ] User feedback integration
- [ ] A/B testing framework

### Phase 3: Scale (Q3 2027)
- [ ] Multi-broker support
- [ ] Personalized AI co-pilot
- [ ] Other financial moments (loans, insurance)
- [ ] Portfolio-level insights

### Phase 4: Platform (Q4 2027+)
- [ ] Full SIP Guardian ecosystem
- [ ] API for third-party platforms
- [ ] Advanced AI features
- [ ] SaaS monetization

## 🤝 Contributing

This is a submission project for IIT Guwahati. Contributions guidelines TBD.

### Development Workflow
1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly (both calculation accuracy and UI)
4. Create pull request with description

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Component-level documentation
- Test coverage for calculation engine

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **IIT Guwahati** for the opportunity and guidance
- **Industry Research** on SIP behavior patterns
- **Open Source Community** for Next.js, React, Tailwind CSS

---

## 📬 Contact

For questions or feedback about this project:
- **Project Lead**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub]

---

**Built with ❤️ for better financial decisions**

*Checkpoint by SIP Guardian - Because every investment decision deserves informed consideration*
