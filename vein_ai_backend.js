const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config(); // Load environment variables from .env file
const app = express();

app.use(cors());
app.use(express.json());

// Secure API key storage - IMPORTANT: Set these in environment variables
const API_KEYS = {
    claude: process.env.CLAUDE_API_KEY,
    openai: process.env.OPENAI_API_KEY
};

// Validate API keys are present
if (!API_KEYS.claude || !API_KEYS.openai) {
    console.error('ERROR: API keys not found. Please set CLAUDE_API_KEY and OPENAI_API_KEY environment variables.');
    console.log('For local development, create a .env file with your keys.');
    console.log('For production, set these in your hosting platform\'s environment settings.');
}

// Encryption for patient data
const algorithm = 'aes-256-gcm';
const secretKey = crypto.randomBytes(32);

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

// Advanced Vein Assessment Scoring Algorithm
class VeinAssessmentEngine {
    constructor() {
        this.symptomWeights = {
            'visible': 2,
            'aching': 3,
            'swelling': 4,
            'pain': 5,
            'itching': 2,
            'cramping': 3,
            'discoloration': 5,
            'restless': 3,
            'ulcers': 8,
            'bleeding': 7,
            'hardening': 6,
            'burning': 4,
            'throbbing': 4,
            'heaviness': 3
        };

        this.riskFactors = {
            age: { under30: 1, '30-50': 2, over50: 3 },
            genetics: { none: 1, some: 2, strong: 3 },
            occupation: { sedentary: 2, standing: 3, active: 1 },
            pregnancy: { never: 1, past: 2, current: 3 },
            obesity: { normal: 1, overweight: 2, obese: 3 }
        };
    }

    calculateCEAPScore(symptoms, severity) {
        // Clinical, Etiological, Anatomical, Pathophysiological classification
        let ceapClass = 'C0';
        
        if (symptoms.includes('visible')) ceapClass = 'C1';
        if (symptoms.includes('aching') || symptoms.includes('heaviness')) ceapClass = 'C2';
        if (symptoms.includes('swelling')) ceapClass = 'C3';
        if (symptoms.includes('discoloration') || symptoms.includes('hardening')) ceapClass = 'C4';
        if (symptoms.includes('ulcers')) {
            ceapClass = symptoms.includes('healed_ulcers') ? 'C5' : 'C6';
        }
        
        return {
            class: ceapClass,
            severity: this.getSeverityLevel(symptoms, severity),
            urgency: this.calculateUrgency(symptoms, ceapClass)
        };
    }

    getSeverityLevel(symptoms, impactScore) {
        const symptomScore = symptoms.reduce((total, symptom) => {
            return total + (this.symptomWeights[symptom] || 1);
        }, 0);
        
        const combinedScore = (symptomScore * 2) + (impactScore * 3);
        
        if (combinedScore >= 60) return 'Critical';
        if (combinedScore >= 45) return 'Severe';
        if (combinedScore >= 30) return 'Moderate-High';
        if (combinedScore >= 15) return 'Moderate';
        return 'Mild';
    }

    calculateUrgency(symptoms, ceapClass) {
        const urgentSymptoms = ['ulcers', 'bleeding', 'severe_pain', 'infection'];
        const hasUrgent = symptoms.some(s => urgentSymptoms.includes(s));
        
        if (hasUrgent || ceapClass === 'C6') return 'Urgent - See within 48 hours';
        if (ceapClass === 'C5' || ceapClass === 'C4') return 'High - See within 1 week';
        if (ceapClass === 'C3') return 'Moderate - See within 2 weeks';
        return 'Standard - See within 4 weeks';
    }

    generateTreatmentPlan(assessment, location, goals) {
        const plans = [];
        
        if (location === 'face') {
            plans.push({
                treatment: 'IPL/Laser Therapy',
                sessions: '1-3',
                cost: '£300-800',
                timeline: '4-8 weeks',
                successRate: '85-95%'
            });
        } else {
            if (assessment.class >= 'C3') {
                plans.push({
                    treatment: 'Endovenous Laser Ablation (EVLA)',
                    sessions: '1-2',
                    cost: '£2000-3500',
                    timeline: '6-12 weeks',
                    successRate: '95-98%'
                });
            }
            
            if (assessment.class <= 'C2') {
                plans.push({
                    treatment: 'Sclerotherapy',
                    sessions: '2-4',
                    cost: '£800-1500',
                    timeline: '8-12 weeks',
                    successRate: '80-90%'
                });
            }
            
            if (assessment.severity === 'Critical' || assessment.severity === 'Severe') {
                plans.push({
                    treatment: 'Combined EVLA + Phlebectomy',
                    sessions: '1-2',
                    cost: '£3000-5000',
                    timeline: '12-16 weeks',
                    successRate: '95-99%'
                });
            }
        }
        
        return plans;
    }
}

// AI Analysis Integration
async function analyzeWithClaude(assessmentData) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEYS.claude,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `As a vascular medicine expert, analyze this patient's vein assessment:
                    
                    Location: ${assessmentData.location}
                    Symptoms: ${assessmentData.symptoms.join(', ')}
                    Severity: ${assessmentData.severity}
                    Impact Level: ${assessmentData.impactLevel}/10
                    Goals: ${assessmentData.goals}
                    Age Group: ${assessmentData.ageGroup || 'Not specified'}
                    
                    Provide:
                    1. Clinical priority level (Urgent/High/Moderate/Low)
                    2. Key risk factors to discuss
                    3. Recommended diagnostic tests
                    4. Treatment options ranked by effectiveness
                    5. Expected outcomes and timeline
                    6. Pre-appointment preparation advice
                    
                    Format as JSON with fields: priority, riskFactors, diagnostics, treatments, outcomes, preparation`
                }]
            })
        });

        const data = await response.json();
        return JSON.parse(data.content[0].text);
    } catch (error) {
        console.error('Claude API error:', error);
        return null;
    }
}

async function analyzeWithGPT4(assessmentData) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.openai}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: [{
                    role: 'system',
                    content: 'You are an expert vascular surgeon specializing in minimally invasive vein treatments. Provide medical-grade analysis while being empathetic and clear.'
                }, {
                    role: 'user',
                    content: `Analyze this vein assessment and provide personalized recommendations:
                    
                    Patient Profile:
                    - Vein Location: ${assessmentData.location}
                    - Symptoms: ${assessmentData.symptoms.join(', ')}
                    - Severity Score: ${assessmentData.severity}
                    - Daily Impact: ${assessmentData.impactLevel}/10
                    - Treatment Goals: ${assessmentData.goals}
                    
                    Generate:
                    1. Urgency assessment with reasoning
                    2. Top 3 priority factors affecting treatment
                    3. Specific preparation instructions for consultation
                    4. Clinical notes for the treating physician
                    5. Patient education points
                    
                    Return as JSON with clear, professional language.`
                }],
                temperature: 0.3,
                max_tokens: 800
            })
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error('GPT-4 API error:', error);
        return null;
    }
}

// Main Assessment Endpoint
app.post('/api/assess', async (req, res) => {
    const assessmentData = req.body;
    const engine = new VeinAssessmentEngine();
    
    // Encrypt patient data
    const encryptedData = encrypt(JSON.stringify({
        name: assessmentData.contact.firstName,
        email: assessmentData.contact.email,
        phone: assessmentData.contact.phone
    }));
    
    // Calculate clinical scores
    const ceapScore = engine.calculateCEAPScore(
        assessmentData.symptoms,
        assessmentData.impactLevel
    );
    
    // Generate treatment plans
    const treatmentPlans = engine.generateTreatmentPlan(
        ceapScore,
        assessmentData.location,
        assessmentData.goals
    );
    
    // Get AI analysis from both models
    const [claudeAnalysis, gptAnalysis] = await Promise.all([
        analyzeWithClaude(assessmentData),
        analyzeWithGPT4(assessmentData)
    ]);
    
    // Combine insights
    const aiTriage = {
        urgencyLevel: claudeAnalysis?.priority || ceapScore.urgency,
        recommendedAssessment: ceapScore.severity === 'Critical' || ceapScore.severity === 'Severe' ? 'comprehensive' : 'standard',
        priorityFactors: [
            ...(claudeAnalysis?.riskFactors || []),
            ...(gptAnalysis?.priorityFactors || [])
        ].slice(0, 5),
        urgencyReasoning: gptAnalysis?.urgencyReasoning || 'Based on symptom analysis',
        preparationAdvice: claudeAnalysis?.preparation || gptAnalysis?.preparationInstructions || 'Standard preparation required',
        clinicalNotes: gptAnalysis?.clinicalNotes || 'Comprehensive assessment recommended',
        treatmentOptions: treatmentPlans,
        ceapClassification: ceapScore,
        patientEducation: gptAnalysis?.educationPoints || []
    };
    
    // Store assessment (in production, use proper database)
    const assessmentId = crypto.randomBytes(16).toString('hex');
    
    res.json({
        success: true,
        assessmentId,
        aiTriage,
        encryptedData: encryptedData.encrypted,
        timestamp: new Date().toISOString()
    });
});

// Endpoint for symptom analysis
app.post('/api/analyze-symptoms', async (req, res) => {
    const { symptoms, location } = req.body;
    const engine = new VeinAssessmentEngine();
    
    const analysis = {
        immediate: symptoms.some(s => ['ulcers', 'bleeding', 'severe_pain'].includes(s)),
        requiresUltrasound: location === 'legs' && symptoms.length > 2,
        estimatedSessions: symptoms.length > 4 ? '3-5' : '1-3',
        successProbability: symptoms.includes('ulcers') ? '70-80%' : '85-95%'
    };
    
    res.json(analysis);
});

// Real-time cost estimation
app.post('/api/estimate-cost', async (req, res) => {
    const { location, symptoms, severity } = req.body;
    
    let baseConsultation = location === 'face' ? 50 : 250;
    let treatmentMin = 300;
    let treatmentMax = 800;
    
    if (location === 'legs') {
        treatmentMin = 800;
        treatmentMax = 2000;
        
        if (symptoms.includes('ulcers')) {
            treatmentMax += 1500;
        }
        
        if (severity > 7) {
            treatmentMax += 1000;
        }
    }
    
    res.json({
        consultation: baseConsultation,
        treatmentRange: {
            min: treatmentMin,
            max: treatmentMax
        },
        paymentPlans: [
            { months: 3, monthly: Math.round((treatmentMax / 3) * 1.05) },
            { months: 6, monthly: Math.round((treatmentMax / 6) * 1.08) },
            { months: 12, monthly: Math.round((treatmentMax / 12) * 1.12) }
        ]
    });
});

// Patient journey tracking
app.post('/api/track-journey', async (req, res) => {
    const { assessmentId, stage, data } = req.body;
    
    // In production, store in database
    console.log(`Journey tracked: ${assessmentId} - Stage: ${stage}`);
    
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cosmex Vein Centre AI Backend running on port ${PORT}`);
});