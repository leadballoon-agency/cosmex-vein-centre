# GoHighLevel Integration Guide

## Purpose of the AI Tool
**This is a LEAD QUALIFICATION tool, not a medical assessment system.**

The AI creates a "wow" experience to:
1. Capture qualified leads for Cosmex Clinic
2. Determine if they need £50 consultation (facial) or £250 scan (legs)
3. Provide Kerry with detailed information for qualification calls
4. NOT provide medical diagnosis - that's done by Cosmex Clinic

## How It Works

### 1. User Completes Assessment
- 7 intelligent questions with AI engagement
- Creates impressive experience ("world's most advanced")
- Captures contact details

### 2. AI Determines Pathway
- **Facial Veins** → £50 consultation with IPL/980nm laser
- **Leg Veins** → Choice between:
  - £250 ultrasound scan (WITH 12-month guarantee)
  - £50 consultation (NO guarantee, high risk of recurrence)

### 3. Lead Sent to GHL
The `/api/ghl-webhook` endpoint sends Kerry:
```json
{
  "firstName": "Patient name",
  "email": "patient@email.com",
  "phone": "07700900000",
  "recommendedPathway": "FACIAL_50" or "LEGS_SCAN_250",
  "urgencyLevel": "HIGH_PRIORITY/MODERATE/STANDARD",
  "primarySymptoms": "bulging, aching, spider veins",
  "severityScore": 7,
  "aiRecommendation": "Specific pathway recommendation",
  "keyTalkingPoints": ["Points for Kerry's script"],
  "requiresUltrasound": true/false,
  "fullAssessment": "Complete data in JSON"
}
```

### 4. Kerry Calls Every Lead
- Uses AI qualification data
- Discusses appropriate pathway
- Takes payment (£50 or £250)
- Books appointment with Cosmex Clinic

### 5. Cosmex Clinic Performs Treatment
- Real medical assessment
- Actual treatment by NHS consultants
- Anam performs ultrasound scans

## Setting Up GHL Webhook

### Step 1: Get Your GHL Webhook URL
1. Log into GoHighLevel
2. Go to Settings → Webhooks
3. Create new webhook for "Vein Assessment Leads"
4. Copy the webhook URL

### Step 2: Add to Vercel Environment
1. Go to Vercel Dashboard
2. Select cosmex-vein-centre project
3. Settings → Environment Variables
4. Add: `GHL_WEBHOOK_URL` = your webhook URL

### Step 3: Map Fields in GHL
Map these fields to your GHL contact fields:
- `firstName` → First Name
- `email` → Email
- `phone` → Phone
- `recommendedPathway` → Custom Field: Treatment Path
- `urgencyLevel` → Custom Field: Priority
- `primarySymptoms` → Custom Field: Symptoms
- `severityScore` → Custom Field: Severity (1-15)
- `fullAssessment` → Notes

### Step 4: Set Up Automation
Create GHL workflow:
1. Trigger: Webhook received
2. Add tag based on pathway (facial_50 or legs_250)
3. Add to pipeline: "Vein Assessment Leads"
4. Assign to Kerry
5. Send notification to Kerry for HIGH_PRIORITY leads

## Kerry's Script Guide

### For Facial Veins (£50 Pathway)
"Hi [Name], I see from your assessment that you have facial veins. Good news - these are straightforward to treat with our IPL or 980nm laser. The £50 consultation includes a test patch to ensure your skin responds well. No ultrasound needed for facial veins."

### For Leg Veins - High Risk (£250 Strongly Recommended)
"Hi [Name], based on your symptoms of [symptoms], you have indicators that require proper ultrasound scanning. Without identifying feeder veins with our £250 scan, any treatment would be temporary. The scan comes with our 12-month guarantee."

### For Leg Veins - Moderate (Choice)
"Hi [Name], you have two options: Our £250 ultrasound scan which comes with a 12-month guarantee, or a £50 consultation without guarantee. I strongly recommend the scan as it identifies hidden feeder veins - without this, veins typically return within 2-3 months."

## Important Notes

1. **AI is for qualification only** - Not medical advice
2. **Every lead gets a call** - Kerry qualifies all leads
3. **Focus on value** - £250 scan prevents repeat treatments
4. **Emphasize guarantee** - Only with £250 scan
5. **Clinic does treatment** - We generate qualified leads

## Testing the Integration

1. Complete assessment at: https://cosmex-vein-centre.vercel.app
2. Check GHL received the lead
3. Verify all fields mapped correctly
4. Test Kerry's workflow triggers

## Troubleshooting

### Lead not appearing in GHL?
- Check `GHL_WEBHOOK_URL` in Vercel environment
- Verify webhook is active in GHL
- Check browser console for errors

### Missing data fields?
- Ensure GHL custom fields are created
- Check field mapping in webhook settings

### Wrong pathway recommended?
- Facial always = £50
- Legs with ulcers/bleeding = £250 required
- Others = Kerry discusses options