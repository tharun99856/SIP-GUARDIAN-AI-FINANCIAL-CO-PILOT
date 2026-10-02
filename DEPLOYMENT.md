# Deployment Guide
## Checkpoint by SIP Guardian

This guide covers deploying the Checkpoint MVP to Vercel for production use.

---

## Prerequisites

- Vercel account (free tier works for MVP)
- GitHub repository
- OpenAI or Anthropic API key
- Node.js 18+ installed locally

---

## Step 1: Prepare Repository

### 1.1 Push to GitHub

```bash
cd checkpoint-sip-guardian

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Checkpoint by SIP Guardian MVP"

# Create GitHub repo and push
git remote add origin https://github.com/your-username/checkpoint-sip-guardian.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Build Locally

```bash
npm run build
```

If build succeeds, you're ready to deploy.

---

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 2.3 Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
# AI Provider - Choose ONE (Gemini recommended for free tier!)
GEMINI_API_KEY=your_gemini_key_here
# OR
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here

NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_SHADOW_MODE=true
```

> **💡 Get Free Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and generate a free API key. No credit card required!

### 2.4 Deploy

Click **Deploy**. Vercel will:
- Install dependencies
- Run build
- Deploy to global CDN
- Provide a URL (e.g., `checkpoint-sip-guardian.vercel.app`)

---

## Step 3: Verify Deployment

### 3.1 Test Pages

Visit your deployment URL and test:

- ✅ Homepage loads: `https://your-app.vercel.app/`
- ✅ Checkpoint demo: `https://your-app.vercel.app/checkpoint`
- ✅ Dashboard: `https://your-app.vercel.app/dashboard`

### 3.2 Test AI Explanation

1. Go to `/checkpoint`
2. Select "Cancel SIP"
3. Click "Continue with Cancellation"
4. Wait for AI explanation to load
5. Verify it shows meaningful content (not just "Calculating...")

### 3.3 Test Analytics

1. Complete a checkpoint session
2. Go to `/dashboard`
3. Verify session appears in metrics
4. Check that metrics are calculated correctly

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `checkpoint.sipguardian.com`)
3. Follow DNS configuration instructions

### 4.2 Update DNS

Add CNAME record pointing to Vercel:
```
checkpoint.sipguardian.com → cname.vercel-dns.com
```

---

## Step 5: Monitoring & Analytics

### 5.1 Vercel Analytics

Enable in dashboard:
- **Analytics → Enable**
- Provides: Page views, performance metrics

### 5.2 Error Tracking

Vercel automatically captures:
- Build errors
- Runtime errors
- API route failures

View in **Deployments → [Your Deployment] → Logs**

### 5.3 Custom Analytics

All checkpoint sessions are tracked via `/api/analytics/*` endpoints.

To export data:
```bash
# Visit dashboard and click "Export CSV"
# Or use API directly:
curl https://your-app.vercel.app/api/analytics/session
```

---

## Step 6: Database Setup (Production)

For production, replace in-memory storage with a real database.

### 6.1 Recommended: Vercel Postgres

```bash
# Install Vercel Postgres package
npm install @vercel/postgres

# Add to environment variables in Vercel:
POSTGRES_URL="postgres://..."
```

### 6.2 Create Tables

```sql
CREATE TABLE analytics_events (
  event_id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_metrics (
  session_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  original_action VARCHAR(20) NOT NULL,
  final_action VARCHAR(20),
  alternative_viewed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER,
  informed_decision BOOLEAN,
  user_friction VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_session ON analytics_events(session_id);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_events_type ON analytics_events(event_type);
CREATE INDEX idx_metrics_user ON session_metrics(user_id);
```

### 6.3 Update API Routes

Replace in-memory storage with database queries in:
- `app/api/analytics/track/route.ts`
- `app/api/analytics/session/route.ts`

---

## Step 7: Security Hardening

### 7.1 API Rate Limiting

Add to API routes:

```typescript
// Install: npm install @vercel/edge-rate-limit
import { rateLimit } from '@vercel/edge';

const limiter = rateLimit({
  interval: '1m',
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  await limiter.check(10, 'CACHE_TOKEN'); // 10 requests per minute
  // ... rest of handler
}
```

### 7.2 CORS Configuration

For API routes accessed from other domains:

```typescript
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://your-broker-app.com'];
  
  if (!allowedOrigins.includes(origin || '')) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... rest of handler
}
```

### 7.3 Content Security Policy

Add to `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

---

## Step 8: Performance Optimization

### 8.1 Enable Edge Functions

For AI explanation endpoint, use Edge Runtime:

```typescript
// app/api/ai-explain/route.ts
export const runtime = 'edge';
```

### 8.2 Image Optimization

If adding images in future:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Checkpoint Logo"
/>
```

### 8.3 Code Splitting

Next.js handles this automatically, but verify:

```bash
npm run build

# Check bundle sizes in output
# Large components should be dynamically imported
```

---

## Step 9: Continuous Deployment

### 9.1 Automatic Deploys

Vercel automatically deploys when you push to `main`:

```bash
git add .
git commit -m "Update: improve AI explanation prompt"
git push origin main
```

### 9.2 Preview Deployments

Every pull request gets a preview URL:

```bash
git checkout -b feature/new-alternative
# Make changes
git push origin feature/new-alternative
# Create PR on GitHub
# Vercel comments with preview URL
```

### 9.3 Rollback

If deployment fails:
1. Go to Vercel dashboard
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

---

## Step 10: Post-Deployment Checklist

### ✅ Functional Testing

- [ ] Homepage loads without errors
- [ ] Checkpoint screen displays calculations correctly
- [ ] AI explanation generates (or fallback works)
- [ ] Alternatives show with proper formatting
- [ ] Analytics dashboard displays metrics
- [ ] CSV export works

### ✅ Performance Testing

- [ ] Lighthouse score > 90 (mobile & desktop)
- [ ] First load time < 3 seconds
- [ ] AI explanation < 5 seconds
- [ ] No console errors

### ✅ Security Testing

- [ ] HTTPS enforced
- [ ] API keys not exposed in client code
- [ ] No sensitive data in logs
- [ ] CORS configured correctly (if needed)

### ✅ Analytics Testing

- [ ] Events tracked correctly
- [ ] Session metrics captured
- [ ] Dashboard displays real data
- [ ] No data loss

### ✅ Compliance Verification

- [ ] Disclaimers visible
- [ ] "Not investment advice" clear
- [ ] Original action always accessible
- [ ] No pressure tactics present

---

## Troubleshooting

### Issue: Build Fails

**Check:**
```bash
# Run locally first
npm run build

# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Environment variables
```

**Solution:**
Fix errors locally, commit, push again.

### Issue: AI Explanation Not Working

**Check:**
1. Environment variable set correctly
2. API key valid and has credits
3. Check Vercel logs for error messages

**Solution:**
```bash
# View logs
vercel logs your-deployment-url
```

### Issue: Slow Performance

**Check:**
1. Bundle size (should be < 500KB initial)
2. API response times
3. Database queries (if using)

**Solution:**
- Implement caching
- Optimize images
- Use Edge Functions

### Issue: Analytics Not Tracking

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Vercel function logs

**Solution:**
Verify API routes are deployed and accessible.

---

## Maintenance

### Weekly Tasks
- Check error logs in Vercel dashboard
- Review analytics metrics
- Monitor AI API usage and costs

### Monthly Tasks
- Review and optimize bundle size
- Update dependencies (`npm outdated`)
- Analyze user feedback
- Check Stop/Go criteria

### Quarterly Tasks
- Security audit
- Performance optimization review
- Compliance check
- Cost optimization

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **OpenAI API:** https://platform.openai.com/docs
- **Anthropic API:** https://docs.anthropic.com

---

## Cost Estimates

### Vercel (Hobby tier - Free)
- **Bandwidth:** 100GB/month
- **Builds:** 100 hours/month
- **Functions:** 100GB-hrs
- **Sufficient for:** MVP testing (< 1000 users)

### Vercel (Pro - $20/month)
- **Bandwidth:** 1TB/month
- **Builds:** Unlimited
- **Functions:** 1000GB-hrs
- **Sufficient for:** Phase 2 (< 10,000 users)

### AI API Costs
- **OpenAI GPT-4:** ~$0.03 per explanation
- **Anthropic Claude:** ~$0.02 per explanation
- **Est. cost at 1000 users:** $20-30/month
- **Est. cost at 10K users:** $200-300/month

### Total MVP Costs
- Month 1-3: $0-50/month (testing)
- Month 4-6: $50-200/month (scaling)

---

**Deployment Complete! 🚀**

Your Checkpoint by SIP Guardian MVP is now live and ready for shadow mode testing.

Next steps:
1. Share URL with beta testers
2. Monitor metrics in dashboard
3. Collect user feedback
4. Iterate based on learnings

Good luck! 🎯
