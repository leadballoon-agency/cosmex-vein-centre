# Cosmex Vein Clinic - Assessment Tool Routing Logic (Updated)
## Version 2.0 - Complete Decision Tree

---

## PURPOSE & VALUE PROPOSITION

### For Patients:
- Routes to the RIGHT specialist first time (no wasted appointments)
- Sets clear expectations about costs and treatments
- Prevents booking wrong consultation type
- Provides personalised treatment recommendations

### For Business:
- Prevents specialist time wastage (no varicose patients seeing cosmetic team)
- Increases conversion by educating patients before booking
- Reduces refunds and complaints
- Qualifies leads for Facebook/Google advertising

---

## COMPLETE ROUTING FLOW

### ENTRY POINT: Which area concerns you most?

```
Question 1: Area Selection
├── FACE → [Face Assessment Path - 5 Questions]
├── LEGS → [Leg Assessment Path - 7 Questions]
└── BOTH → [Leg Assessment Path - 7 Questions + Face mention in results]
```

---

## PATH A: FACE VEIN ASSESSMENT (5 Steps)

When user selects **FACE**, they enter a dedicated 5-step facial assessment:

### Face Step 1: Which facial areas are affected? (Multiple Selection)
- ✓ Cheeks
- ✓ Nose
- ✓ Chin
- ✓ Around eyes
- ✓ Forehead
*User can select multiple areas*

### Face Step 2: What type of facial veins?
- Small red thread veins
- Blue/purple veins
- Rosacea/general redness
- Broken capillaries

### Face Step 3: How long have you had them?
- Less than 6 months
- 6 months - 2 years
- 2-5 years
- More than 5 years

### Face Step 4: Have you noticed any triggers?
- Sun exposure
- Temperature changes
- Alcohol/spicy foods
- Pregnancy/hormones
- No clear triggers

### RESULT: Facial Vein Treatment Plan
**Routes to: COSMEX TEAM**
- **Booking:** £50 Facial Consultation
- **Specialists:** Cosmex Me or Consi
- **Treatment:** 980nm laser or IPL technology
- **Note:** No guarantee (cosmetic treatment only)
- **Message:** "Gentle, effective treatment with no downtime"

---

## PATH B: LEG VEIN ASSESSMENT (7 Steps)

When user selects **LEGS** or **BOTH**:

### Question 2: What type of veins are you seeing?

#### → VARICOSE VEINS
**IMMEDIATE ROUTING to: CVC MEDICAL TEAM**
- **Required:** £250 Duplex Ultrasound Scan
- **Team:** Mr Faisal Kahloon / Anam Akhtar
- **Treatment:** RFA (Radiofrequency Ablation)
- **Guarantee:** 12-month guarantee on treatments following scan

#### → SPIDER/THREAD VEINS ONLY
*Continue to Question 3...*

#### → BOTH TYPES
**IMMEDIATE ROUTING to: CVC MEDICAL TEAM**
- **Required:** £250 Duplex Ultrasound Scan
- **Reason:** Mixed presentation requires full medical assessment
- **Guarantee:** 12-month guarantee on treatments following scan

#### → NOT SURE
*Continue to Question 3...*

---

### Question 3: Do you experience any symptoms?

#### → SEVERE SYMPTOMS (Skin changes, ulcers, bleeding)
**URGENT ROUTING to: CVC MEDICAL TEAM**
- **Priority:** Same-week appointment if possible
- **Required:** £250 Duplex Ultrasound Scan
- **Message:** "Medical intervention required - not cosmetic"

#### → MODERATE SYMPTOMS (Regular pain, swelling, cramping)
**ROUTING to: CVC MEDICAL TEAM**
- **Required:** £250 Duplex Ultrasound Scan
- **Reason:** Symptoms indicate venous insufficiency
- **Guarantee:** 12-month guarantee on treatments following scan

#### → MILD SYMPTOMS (Occasional aching)
*Continue to Question 4...*

#### → NO SYMPTOMS (Cosmetic only)
*Continue to Question 4...*

---

### Question 4: Risk Factors (MULTIPLE SELECTION ALLOWED)

Users can select multiple options:
- ✓ Family history of varicose veins
- ✓ Pregnancy-related veins
- ✓ Standing/sitting job
- ✓ None of these

**Logic:** If "None" selected, other options deselect. If any other selected, "None" deselects.

#### RISK ASSESSMENT:
- **ANY risk factor selected** → Higher likelihood of needing scan
- **Multiple risk factors** → Strong scan recommendation
- **"None of these"** → May be suitable for cosmetic-only treatment

---

### Question 5: How long have you had these veins?

- Less than 6 months (Recent)
- 6-12 months (Developing)
- 1-2 years (Established)
- More than 2 years (Long-standing)

**Impact:** Long-standing veins (>2 years) strengthen scan recommendation

---

### Question 6: Previous vein treatments?

- No previous treatment
- Sclerotherapy
- Laser treatment
- Surgery (vein stripping)
- Other treatment

#### → ANY PREVIOUS TREATMENT
**ROUTING to: CVC MEDICAL TEAM**
- **Required:** £250 Duplex Ultrasound Scan
- **Reason:** Recurrence indicates underlying venous insufficiency
- **Message:** "Previous treatment suggests deeper vein issues"

---

### Question 7: Treatment urgency?

- As soon as possible
- Within 1-2 months
- Within 3-6 months
- Just researching

**Impact:** Urgency affects appointment prioritisation and messaging tone

---

## FINAL ROUTING DECISIONS

### Route to CVC MEDICAL TEAM (£250 Scan):
✓ ANY varicose veins visible
✓ ANY moderate/severe symptoms
✓ Previous vein treatment (recurrence)
✓ Multiple risk factors
✓ Long-standing veins (>2 years) WITH symptoms
✓ Mixed vein presentation
✓ Pregnancy-related WITH symptoms

### Offer CHOICE (Scan vs Basic Consultation):
✓ Spider/thread veins only
✓ No symptoms
✓ No/minimal risk factors
✓ Recent onset (<6 months)
✓ Cosmetic concerns only

When offering choice:
- **Option 1:** £250 Duplex Scan (RECOMMENDED)
  - "Only way to rule out underlying issues"
  - "Treatments include 12-month guarantee"
- **Option 2:** £50 Basic Consultation
  - "Visual assessment only"
  - "No guarantee without scan"
  - "May need scan anyway"

### Route to COSMEX TEAM (£50 Consultation):
✓ Face veins (automatic after face assessment)
✓ Thread veins with NO symptoms AND NO risk factors
✓ Patient explicitly chooses cosmetic-only option

---

## KEY MESSAGING THROUGHOUT

### Guarantee Context (Updated):
- "Treatments following scan include 12-month guarantee"
- "Future treatments protected by 12-month guarantee"
- "Any treatment after scan includes guarantee"

### Medical vs Cosmetic:
- Varicose = ALWAYS medical
- Symptoms = USUALLY medical
- Risk factors = CONSIDER medical
- Face = ALWAYS cosmetic
- No symptoms/risks = MAY BE cosmetic

### Scan Benefits:
- "Identifies root cause, not just visible symptoms"
- "Prevents recurrence by treating underlying issues"
- "Only accurate way to diagnose vein problems"
- "Required for insurance claims"

---

## TECHNICAL IMPLEMENTATION

### Progress Tracking:
- Face path: 5 steps (20% progress per step)
- Leg path: 7 steps (14.3% progress per step)
- Counter shows "Face Assessment - Step X of 5" or "Question X of 7"

### User Experience:
- Back button functional throughout
- ESC key resets to welcome
- Multiple selections enabled where appropriate
- Smooth transitions (no page jumping)
- Mobile-responsive design

### Data Captured:
- Area of concern (face/legs/both)
- Vein types visible
- Symptom severity
- Risk factors (multiple)
- Duration
- Previous treatments
- Urgency
- Final routing decision

---

## BUSINESS BENEFITS

1. **Conversion Optimisation**
   - Educated patients book appropriate services
   - Reduced no-shows (expectations set)
   - Higher treatment acceptance (understand value)

2. **Operational Efficiency**
   - Right patient → Right specialist → First time
   - No time wasted on inappropriate consultations
   - Reduced admin handling wrong bookings

3. **Marketing Intelligence**
   - Track patient types and concerns
   - Optimise ad targeting based on data
   - Measure conversion by patient type

4. **Risk Management**
   - Medical cases properly identified
   - Cosmetic limitations clearly stated
   - Guarantee conditions transparent

---

## FACEBOOK/GOOGLE ADS INTEGRATION

The assessment tool serves as an excellent landing page because it:
- Increases engagement (interactive vs static page)
- Qualifies leads before booking
- Provides value immediately (personalised recommendation)
- Reduces cost per qualified lead
- Improves quality score (relevant, engaging content)

---

*This routing logic ensures optimal patient care while protecting business efficiency and maintaining clear medical/cosmetic boundaries.*