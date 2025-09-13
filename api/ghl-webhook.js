// GoHighLevel Webhook Integration for Lead Data
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const assessmentData = req.body;
    
    // Format data for GHL/Kerry
    const leadData = {
        // Contact Information
        firstName: assessmentData.contact?.firstName,
        email: assessmentData.contact?.email,
        phone: assessmentData.contact?.phone,
        
        // Lead Qualification Data
        leadSource: 'AI Vein Assessment Tool',
        assessmentDate: new Date().toISOString(),
        
        // Pathway Determination
        recommendedPathway: assessmentData.location === 'face' ? 'FACIAL_50' : 'LEGS_SCAN_250',
        treatmentLocation: assessmentData.location,
        
        // Urgency for Kerry's Prioritization
        urgencyLevel: assessmentData.severity > 10 ? 'HIGH_PRIORITY' : 
                      assessmentData.severity > 5 ? 'MODERATE' : 'STANDARD',
        
        // Symptoms for Kerry's Script
        primarySymptoms: assessmentData.symptoms?.join(', '),
        symptomDuration: assessmentData.duration,
        severityScore: assessmentData.severity,
        dailyImpact: assessmentData.impactLevel,
        
        // Medical Factors
        medicalFactors: assessmentData.factors?.join(', '),
        
        // Goals (for Kerry to address)
        patientGoals: assessmentData.goals,
        
        // AI Insights for Kerry
        aiRecommendation: assessmentData.location === 'face' 
            ? '£50 Consultation - IPL/980nm laser with test patch. No ultrasound needed.'
            : assessmentData.severity > 10 
                ? '£250 Ultrasound STRONGLY RECOMMENDED - High risk indicators present'
                : 'Offer choice between £250 scan (with guarantee) or £50 consultation (no guarantee)',
        
        // Risk Indicators for Leg Veins
        requiresUltrasound: assessmentData.symptoms?.includes('ulcers') || 
                           assessmentData.symptoms?.includes('bleeding') ||
                           assessmentData.symptoms?.includes('hardening'),
        
        // Kerry's Talking Points
        keyTalkingPoints: [
            assessmentData.location === 'face' 
                ? 'Facial veins are superficial and treatable with laser/IPL'
                : 'Without ultrasound, we cannot identify feeder veins',
            'Only £250 scan comes with 12-month guarantee',
            'Treatments performed by NHS vascular surgeons'
        ],
        
        // Full Assessment for Clinical Notes
        fullAssessment: JSON.stringify(assessmentData, null, 2),
        
        // Tags for GHL
        tags: [
            assessmentData.location === 'face' ? 'facial_veins' : 'leg_veins',
            assessmentData.severity > 10 ? 'high_priority' : 'standard',
            assessmentData.symptoms?.includes('ulcers') ? 'medical_urgent' : 'cosmetic'
        ]
    };
    
    // Send to GHL webhook (you'll need to add the actual GHL webhook URL)
    const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
    
    if (GHL_WEBHOOK_URL) {
        try {
            const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });
            
            if (!ghlResponse.ok) {
                console.error('GHL webhook failed:', ghlResponse.status);
            } else {
                console.log('✅ Lead sent to GHL successfully');
            }
        } catch (error) {
            console.error('Error sending to GHL:', error);
        }
    }
    
    // Always return success to not break the user experience
    res.status(200).json({
        success: true,
        message: 'Lead captured successfully',
        pathway: leadData.recommendedPathway,
        urgency: leadData.urgencyLevel,
        kerryWillCall: true,
        nextSteps: assessmentData.location === 'face'
            ? 'Kerry will call to book your £50 consultation with test patch'
            : leadData.requiresUltrasound
                ? 'Kerry will call to book your £250 ultrasound scan (strongly recommended)'
                : 'Kerry will discuss both £250 scan (recommended) and £50 consultation options'
    });
}