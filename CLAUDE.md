# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lead qualification and assessment system for Cosmex Vein Clinic Cambridge. It's **NOT a medical diagnostic tool** - it's a sophisticated lead generation system that uses AI to create an impressive "wow" experience and route patients to the appropriate consultation pathway.

**Key Business Model:**
- Lead generation for Cosmex Vein Clinic (CVC)
- Routes patients to either £50 consultation (facial) or £250 ultrasound scan (legs)
- Kerry (appointment setter) qualifies all leads and takes payment
- CVC performs actual medical assessment and treatment

## Development Commands

### Running the Application
```bash
# Start backend server (local development)
npm start

# Start with auto-reload
npm dev

# Run tests
npm test
```

### Deployment
The application is deployed on Vercel:
```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Key URLs
- Production: https://cosmex-vein-centre.vercel.app
- Main landing page: `index.html`
- Assessment starts automatically on page load

## Architecture & Structure

### Frontend Architecture
**Single-Page Application (SPA) with Intelligent State Management**

The main assessment is in `index.html` which contains:
1. **Welcome Card** - Initial entry point with "Start Assessment" button
2. **7-Step Assessment Flow** (for legs) or **5-Step Assessment Flow** (for face)
3. **Dynamic Results** - Shows personalized treatment recommendations

**Critical UX Flow:**
- User clicks "Start Assessment" → Shows "Which area concerns you most?" (Face/Legs/Both)
- **Face path** → 5 specialized facial vein questions → Routes to £50 consultation
- **Legs path** → 7 detailed questions → Routes to either £250 scan or £50 consultation based on risk factors
- **Both path** → Goes through legs assessment, mentions face in results

**State Management Pattern:**
- Assessment data stored in `window.assessmentData` object
- Progress tracked with step counters (Question X of 7)
- ESC key resets to welcome screen
- Back button functional throughout

### Backend Architecture (Serverless Functions)

Located in `/api/` directory - these are Vercel serverless functions:

**Key API Endpoints:**
- `api/assess-v2.js` - Main assessment logic (currently active)
- `api/ghl-webhook.js` - Sends lead data to GoHighLevel CRM
- `api/advanced-ai.js` - Claude and GPT-4 integration for AI insights
- `api/health.js` - Health check endpoint

**Legacy Files:**
- `vein_ai_backend.js` - Original Express backend (not used in Vercel deployment)
- `api/assess.js` - Original assess endpoint (superseded by assess-v2.js)

### Critical Business Logic

**The Two Treatment Pathways:**

1. **FACIAL VEINS** (Always £50)
   - Treatment: 980nm laser or IPL
   - No ultrasound needed
   - Straightforward booking

2. **LEG VEINS** (Risk-based routing)
   - **£250 Ultrasound Scan** (Recommended for high-risk cases)
     - Includes 12-MONTH GUARANTEE
     - Identifies feeder veins to prevent recurrence
     - Required for: varicose veins, ulcers, bleeding, severe symptoms
   - **£50 Basic Consultation** (Only for low-risk cosmetic cases)
     - NO guarantee
     - High risk of recurrence if feeder veins not identified
     - Only offered when no serious risk factors present

**Risk Scoring System** (see `js/intelligent-assessment.js`):
```javascript
// High-risk indicators that REQUIRE £250 scan:
- Ulcers (score +10)
- Bleeding veins (score +8)
- Skin hardening (score +7)
- Duration >2 years (score +5)
- High severity >10 (score +6)

// Risk score >= 5 → Route to £250 scan
// Risk score < 5 → Offer choice
```

### Routing Logic Implementation

**Critical Document:** `assessment-routing-logic-updated.md` contains the complete decision tree. This is the source of truth for all routing decisions.

**Key Routing Rules:**
- ANY varicose veins → £250 scan (medical, not cosmetic)
- Face veins → £50 consultation (cosmetic)
- Severe symptoms (ulcers, bleeding) → £250 scan URGENT
- Previous treatment that failed → £250 scan (recurrence indicates underlying issues)
- Thread/spider veins only + no symptoms → Offer choice

**Implementation Location:**
- Frontend logic: `js/intelligent-assessment.js`
- Assessment questions: `index.html` (embedded in HTML)
- Results display: `index.html` (dynamic based on pathway)

### GoHighLevel Integration

**Purpose:** Send qualified lead data to Kerry for follow-up calls

**Webhook Endpoint:** `api/ghl-webhook.js`

**Data Sent to GHL:**
```javascript
{
  firstName, email, phone,
  recommendedPathway: 'FACIAL_50' | 'LEGS_SCAN_250',
  urgencyLevel: 'HIGH_PRIORITY' | 'MODERATE' | 'STANDARD',
  primarySymptoms: "string of symptoms",
  severityScore: 0-15,
  aiRecommendation: "specific pathway recommendation",
  keyTalkingPoints: ["array for Kerry's script"],
  requiresUltrasound: boolean,
  fullAssessment: "complete JSON"
}
```

**Environment Variable Required:**
- `GHL_WEBHOOK_URL` - Set in Vercel environment variables

### AI Integration (Currently Inactive)

The system has advanced AI capabilities built in but may not be actively used:

**Claude API** (`api/advanced-ai.js`):
- Medical-grade clinical assessment
- Urgency triage and risk factors
- Preparation advice

**GPT-4 API** (`api/advanced-ai.js`):
- Treatment options analysis
- Patient education
- Success rate predictions

**Environment Variables:**
- `CLAUDE_API_KEY`
- `OPENAI_API_KEY`

**Note:** The AI features create the "wow" factor but the core routing logic is rule-based (see routing logic document).

### Important Files & Their Purpose

**Documentation:**
- `assessment-routing-logic-updated.md` - **CRITICAL** - Complete decision tree (v2.0)
- `GHL_INTEGRATION.md` - GoHighLevel webhook setup guide
- `JOHNS_REQUIREMENTS.md` - Business requirements and constraints
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
- `kerry-appointment-setter-playbook.md` - Kerry's call scripts
- `kerry-assessment-data-guide.md` - How Kerry uses assessment data

**Configuration:**
- `vercel.json` - Vercel deployment configuration (serverless functions in /api/)
- `.env` - Environment variables (API keys, webhook URL)
- `package.json` - Dependencies and scripts

**Frontend:**
- `index.html` - Main assessment application (SPA)
- `js/intelligent-assessment.js` - Assessment logic and risk scoring
- `privacy-policy.html` - Privacy policy page
- `terms-of-service.html` - Terms of service page

**Backend:**
- `api/assess-v2.js` - Current assessment endpoint
- `api/ghl-webhook.js` - GHL integration
- `api/advanced-ai.js` - AI integration (Claude + GPT-4)
- `vein_ai_backend.js` - Legacy Express server (not used in Vercel)

## Critical Constraints & Requirements

### Business Rules
1. **Exclusive to CVC** - Only work for Cosmex Vein Clinic for vascular treatments
2. **Accurate Claims Only** - No exaggeration or false promises
3. **CVC Branding** - Maintain consistent branding and style
4. **Approval Required** - Get John's approval for adverts before publishing
5. **No Guarantee Confusion** - 12-month guarantee ONLY applies to treatments following the £250 scan

### Medical/Legal Boundaries
- This is a **lead qualification tool**, NOT a medical diagnostic system
- Do NOT provide medical advice or diagnosis
- Kerry qualifies leads; CVC doctors provide medical assessment
- Neither £50 nor £250 consultation fees are redeemable or refundable

### Technical Constraints
- Deployed on Vercel (serverless architecture)
- API keys must be in environment variables (never in code)
- CORS enabled for cross-origin requests
- 30-second max duration for serverless functions

## Common Development Tasks

### Modifying Assessment Questions
1. Edit `index.html` - Find the question cards section
2. Update routing logic in `js/intelligent-assessment.js`
3. Update decision tree documentation in `assessment-routing-logic-updated.md`
4. Test all pathways (face/legs/both)

### Changing Routing Rules
1. **ALWAYS** consult `assessment-routing-logic-updated.md` first
2. Update risk scoring in `js/intelligent-assessment.js`
3. Update `api/assess-v2.js` if server-side logic needed
4. Test edge cases (e.g., ulcers, bleeding, previous treatment)

### Adding New GHL Fields
1. Update `api/ghl-webhook.js` - Add field to leadData object
2. Update GHL custom fields in CRM
3. Map field in GHL webhook settings
4. Test webhook delivery

### Updating Pricing/Guarantee Language
1. Update `index.html` - Results section
2. Update `js/intelligent-assessment.js` - recommendedTreatment objects
3. Update Kerry's playbook (`kerry-appointment-setter-playbook.md`)
4. Get John's approval before deploying

## Testing Guidelines

### Manual Testing Checklist
- [ ] Face pathway routes to £50 consultation
- [ ] Legs with ulcers/bleeding routes to £250 scan (REQUIRED)
- [ ] Legs with no symptoms routes to choice (£250 recommended)
- [ ] "Both" selection goes through legs assessment
- [ ] ESC key resets to welcome screen
- [ ] Back button works throughout
- [ ] Progress bar updates correctly
- [ ] GHL webhook receives complete data
- [ ] Mobile responsive design works

### Testing API Endpoints Locally
```bash
# Start local server
npm start

# Test assessment endpoint
curl -X POST http://localhost:3000/api/assess-v2 \
  -H "Content-Type: application/json" \
  -d '{"symptoms":["aching"],"location":"legs"}'

# Test GHL webhook
curl -X POST http://localhost:3000/api/ghl-webhook \
  -H "Content-Type: application/json" \
  -d '{"contact":{"firstName":"Test"},"location":"legs"}'
```

## Deployment Workflow

### Vercel Deployment Process
1. Commit changes to git
2. Push to GitHub (auto-deploys to Vercel)
3. Or use `vercel --prod` for immediate production deployment
4. Check Vercel dashboard for build status
5. Test on production URL

### Environment Variables (Vercel Dashboard)
Required variables:
- `GHL_WEBHOOK_URL` - GoHighLevel webhook endpoint
- `CLAUDE_API_KEY` - Anthropic API key (if using AI)
- `OPENAI_API_KEY` - OpenAI API key (if using AI)

### Post-Deployment Checklist
- [ ] Test assessment flow end-to-end
- [ ] Verify GHL webhook works
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test all routing pathways
- [ ] Check console for errors

## Key Stakeholders

- **John** - Clinic Owner, requires approval for adverts
- **Kerry** - Appointment setter, qualifies all leads
- **Anam** - Vascular Scientist (Deputy Head at John Radcliffe Oxford), performs ultrasounds
- **CVC Medical Team** - Mr Faisal Kahloon, NHS vascular surgeons

## Troubleshooting

### Common Issues

**"Lead not appearing in GHL"**
- Check `GHL_WEBHOOK_URL` in Vercel environment
- Verify webhook is active in GHL dashboard
- Check browser console for errors
- Check Vercel function logs

**"Assessment not routing correctly"**
- Review `assessment-routing-logic-updated.md`
- Check risk scoring in `js/intelligent-assessment.js`
- Verify symptom detection logic
- Test with edge cases

**"CORS errors on API calls"**
- Check `vercel.json` headers configuration
- Verify API endpoint CORS headers
- Check browser console for specific error

**"Serverless function timeout"**
- Check Vercel logs
- Reduce function complexity
- Increase timeout in `vercel.json` (max 30s)

### Debug Mode
Add `?debug=true` to URL to see assessment data in console:
```javascript
// In browser console:
console.log(window.assessmentData)
console.log(window.severityScore)
```
