# Cosmex Vein Clinic - Assessment Tool Routing Logic

## Purpose
This document outlines how our assessment tool intelligently routes patients to the correct specialist, preventing wrong bookings and setting appropriate expectations.

---

## ROUTING DECISION TREE

### Question 1: Which area concerns you most?

#### → FACE (Thread veins on face)
**Routes to: COSMEX TEAM**
- **Booking:** £50 Facial Consultation
- **Team:** Cosmex Me or Consi
- **Treatment:** 980nm laser or IPL
- **Guarantee:** No guarantee (cosmetic treatment)

#### → LEGS
*Continues to Question 2...*

#### → BOTH (Face and Legs)
**Routes to: CVC MEDICAL TEAM**
- **Booking:** £250 Duplex Scan + £50 Facial Consultation
- **Reason:** Comprehensive assessment needed
- **Guarantee:** 12-month guarantee on leg treatment

---

### Question 2: What type of veins do you see?

#### → VARICOSE VEINS
**Routes to: CVC MEDICAL TEAM**
- **Booking:** £250 Duplex Ultrasound Scan
- **Team:** Mr Faisal Kahloon / Anam Akhtar
- **Treatment:** RFA (Radiofrequency Ablation)
- **Guarantee:** 12-month guarantee included

#### → SPIDER/THREAD VEINS
*Continues to Question 3...*

#### → BOTH TYPES
**Routes to: CVC MEDICAL TEAM**
- **Booking:** £250 Duplex Ultrasound Scan
- **Reason:** Mixed presentation requires full assessment
- **Guarantee:** 12-month guarantee included

#### → NOT SURE
*Continues to Question 3...*

---

### Question 3: Do you experience any symptoms?

#### → MODERATE SYMPTOMS (Pain, swelling, heaviness)
**Routes to: CVC MEDICAL TEAM**
- **Booking:** £250 Duplex Ultrasound Scan
- **Reason:** Symptoms indicate possible venous insufficiency
- **Guarantee:** 12-month guarantee included

#### → SEVERE SYMPTOMS (Skin changes, ulcers, bleeding)
**Routes to: CVC MEDICAL TEAM - URGENT**
- **Booking:** £250 Duplex Ultrasound Scan (Priority)
- **Reason:** Medical intervention required
- **Guarantee:** 12-month guarantee included

#### → MILD SYMPTOMS (Occasional discomfort)
*Continues to Question 4...*

#### → NO SYMPTOMS (Cosmetic only)
*Continues to Question 4...*

---

### Questions 4-7: Risk Factor Assessment

The tool evaluates additional risk factors:
- **Family history**
- **Pregnancy-related veins**
- **Occupation (standing/sitting)**
- **Previous treatments**
- **Duration of problem**
- **Treatment urgency**

### RISK FACTOR ROUTING RULES:

#### HIGH RISK INDICATORS → CVC MEDICAL TEAM (£250 Scan)
- ✓ Previous vein treatment (recurrence risk)
- ✓ Pregnancy-related veins
- ✓ Long-standing problem (years)
- ✓ Multiple risk factors combined
- ✓ Family history + symptoms

#### LOW RISK → CHOICE OFFERED
Patient sees both options with clear messaging:
- **Option 1:** £250 Duplex Scan (RECOMMENDED)
  - "Only way to accurately diagnose"
  - "Includes 12-month guarantee"
- **Option 2:** £50 Consultation (RISKY)
  - "No guarantee without scan"
  - "May need scan anyway"

---

## GREY AREA HANDLING

### Scenario: "Just a few thread veins"
**Tool Response:**
1. Checks for symptoms (Q3)
2. Checks risk factors (Q4-6)
3. If ANY risk factors present → Routes to £250 scan
4. If NO risk factors → Offers choice but recommends scan

### Why This Works:
- Prevents Cosmex team seeing varicose patients
- Prevents CVC team wasting time on simple cosmetics
- Educates patient BEFORE booking
- Sets expectation for scan requirement

---

## ROUTING OUTCOMES SUMMARY

### To COSMEX Team (£50):
- Face veins only
- Thread veins with NO symptoms and NO risk factors
- Patient explicitly chooses cosmetic-only route

### To CVC Medical Team (£250):
- ALL varicose veins
- ANY moderate/severe symptoms
- ANY significant risk factors
- Mixed presentations
- Previous treatments
- Pregnancy-related
- Long-standing issues

---

## BUSINESS PROTECTION FEATURES

1. **Prevents Wrong Bookings**
   - Face veins can't accidentally book vascular surgeon
   - Varicose veins can't book cosmetic consultation

2. **Sets Scan Expectation**
   - Messaging throughout emphasizes scan importance
   - "Only duplex ultrasound can accurately diagnose"

3. **Liability Management**
   - Routes medical cases to medical team
   - Cosmetic cases clearly marked "no guarantee"

4. **Time Efficiency**
   - No "waiting around for hours" scenario
   - Right patient → Right specialist → First time

---

## KEY MESSAGES THROUGHOUT

- "Only a duplex ultrasound can accurately diagnose vein problems"
- "Thread veins may recur without treating underlying causes"
- "£250 scan includes 12-month guarantee"
- "£50 consultation - no guarantee without scan"

---

## FACEBOOK MARKETING BENEFIT

While ensuring proper medical routing, the tool also:
- Increases engagement (interactive content)
- Reduces cost per lead (better quality leads)
- Improves conversion (educated patients)
- Provides data on patient types

---

*This routing logic ensures every patient reaches the appropriate specialist while protecting both the business and patient outcomes.*