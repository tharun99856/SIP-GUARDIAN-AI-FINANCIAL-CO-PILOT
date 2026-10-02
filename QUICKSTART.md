# Quick Start Guide
## Checkpoint by SIP Guardian MVP

Get the MVP running in 5 minutes!

---

## 🚀 Installation

```bash
# 1. Navigate to project
cd checkpoint-sip-guardian

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and add your API key (optional for testing)
```

---

## 🎮 Run Locally

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📋 Test the Features

### 1. Homepage
**URL:** http://localhost:3000

Shows product overview and links to demo.

### 2. Checkpoint Demo
**URL:** http://localhost:3000/checkpoint

1. Select action type (Cancel/Pause/Reduce)
2. Click "Continue with [Action]"
3. See full intervention screen with:
   - Impact visualization
   - AI explanation (if API key configured)
   - Alternative suggestions
   - Compliance disclaimers

### 3. Analytics Dashboard
**URL:** http://localhost:3000/dashboard

- View real-time metrics
- See Stop/Go criteria evaluation
- Export session data to CSV
- Monitor user friction levels

---

## 🧪 Sample Test Scenarios

### Scenario 1: Cancel SIP
**User:** Investor facing cash crunch  
**Action:** Cancel ₹10,000/month SIP  
**Expected Impact:**
- Shortfall: ~₹15 lakhs
- Goal unreachable
- Lost compounding shown clearly

**Test:**
1. Go to `/checkpoint`
2. Select "Cancel SIP"
3. Verify red warning indicators
4. Check alternatives show reduce/pause options

### Scenario 2: Reduce Amount
**User:** Wants to lower commitment  
**Action:** Reduce from ₹10K to ₹5K  
**Expected Impact:**
- Smaller shortfall than cancel
- Goal delayed but achievable
- Maintains discipline message

**Test:**
1. Select "Reduce Amount"
2. Verify medium-severity warnings
3. Check calculated projections match expectations

### Scenario 3: Pause Temporarily
**User:** Short-term cash flow issue  
**Action:** Pause for 6 months  
**Expected Impact:**
- Minimal impact vs cancel
- Auto-resume messaging
- 6-month relief period shown

**Test:**
1. Select "Pause SIP"
2. Verify pause-specific alternatives
3. Check time-based calculations

---

## 🔍 Verify Core Functionality

### ✅ Calculations
```typescript
// Test in browser console or add to a test file
import { calculateSIPImpact } from '@/lib/calculator';

const testSIP = {
  sipId: 'TEST001',
  investorId: 'USER001',
  monthlyAmount: 10000,
  startDate: '2022-01-01',
  fundName: 'Test Fund',
  fundType: 'equity',
  currentValue: 280000,
  goalAmount: 5000000,
  goalDate: '2035-12-31',
};

const impact = calculateSIPImpact(testSIP, 'cancel');
console.log(impact);
// Should show proper calculations
```

### ✅ AI Explanation
1. Add API key to `.env`
2. Complete checkpoint flow
3. Verify AI explanation loads
4. Check fallback works without API key

### ✅ Analytics
1. Complete 2-3 checkpoint sessions
2. Go to `/dashboard`
3. Verify metrics update
4. Export CSV and check data

---

## 🎨 Customize for Your Use Case

### Change Demo Data
Edit `app/checkpoint/page.tsx`:

```typescript
const demoSIPDetails: SIPDetails = {
  monthlyAmount: 5000,  // Change amount
  goalAmount: 2000000,  // Change goal
  // ... other fields
};
```

### Adjust Assumptions
Edit `lib/calculator.ts`:

```typescript
// Line ~90
const expectedReturn = sipDetails.fundType === 'equity' ? 12 : 8;
const inflationRate = 6;
```

### Modify Alternatives
Edit `lib/calculator.ts` → `generateAlternatives()`:

```typescript
// Add your custom alternatives
alternatives.push({
  id: 'custom-option',
  type: 'custom',
  title: 'Your Alternative',
  // ...
});
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit

# Common fix: delete cache
rm -rf .next
npm run dev
```

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### AI Explanation Not Loading
**Without API Key:**
- Template-based explanation should show
- Check browser console for errors

**With API Key:**
- Verify key is valid
- Check API credits remaining
- Look at network tab for failed requests

---

## 📊 Understanding the Metrics

### Informed Decision Rate
- **Good:** > 60%
- **Meaning:** Users engage with content
- **Calculation:** Time spent ≥ 15 seconds

### User Friction
- **Low:** < 20 seconds (good)
- **Medium:** 20-60 seconds (acceptable)
- **High:** > 60 seconds (redesign needed)

### Alternative Selection Rate
- **Target:** 10-30%
- **Meaning:** Users find alternatives valuable
- **Too low:** Alternatives not compelling
- **Too high:** Original action too scary

### Action Change Rate
- **Meaning:** % who chose different action
- **Good:** 15-40% (validates intervention value)
- **Too high:** Manipulation concern

---

## 🚢 Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide to Vercel.

Quick deploy:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, add environment variables when asked
```

---

## 📚 Learn More

- **Full Documentation:** [README.md](./README.md)
- **Product Requirements:** [docs/PRD.md](./docs/PRD.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 Need Help?

1. Check browser console for errors
2. Review Next.js documentation
3. Check API response in Network tab
4. Verify environment variables

---

## ✅ MVP Checklist

Before considering MVP complete:

- [ ] All pages load without errors
- [ ] Calculations produce correct results
- [ ] AI explanation works (or fallback shows)
- [ ] Alternatives display properly
- [ ] Analytics track sessions
- [ ] Dashboard shows metrics
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Disclaimers visible
- [ ] Performance acceptable (< 3s load)

---

**You're all set! Start testing and collecting feedback.** 🎯

Remember: This is Phase 1 MVP for shadow mode testing. No real SIP transactions are affected. Focus on learning what works and what needs improvement.

**Good luck with IIT Guwahati submission!** 🚀
