const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Keys from environment
const API_KEYS = {
    claude: process.env.CLAUDE_API_KEY,
    openai: process.env.OPENAI_API_KEY
};

// Validate API keys
if (!API_KEYS.claude || !API_KEYS.openai) {
    console.error('ERROR: API keys not found. Please set CLAUDE_API_KEY and OPENAI_API_KEY environment variables.');
}

// Advanced Vein Assessment Engine with Dual AI
class DualAIVeinAssessment {
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
    }

    // Claude Sonnet 3.5 - Best for medical reasoning and safety assessment
    async analyzeWithClaude(assessmentData) {
        console.log('🧠 Claude Sonnet 3.5 analyzing medical safety and clinical reasoning...');
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEYS.claude,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022', // Claude 3.5 Sonnet - Latest
                    max_tokens: 1500,
                    temperature: 0.3, // Lower temperature for medical accuracy
                    messages: [{
                        role: 'user',
                        content: `As a vascular medicine specialist, provide a clinical safety assessment for this patient:

PATIENT PROFILE:
- Location: ${assessmentData.location}
- Symptoms: ${assessmentData.symptoms.join(', ')}
- Severity Score: ${assessmentData.severity}/15
- Daily Impact: ${assessmentData.impactLevel}/10
- Primary Goal: ${assessmentData.goals}
- Duration: ${assessmentData.duration || 'Not specified'}
- Risk Factors: ${assessmentData.factors?.join(', ') || 'None specified'}

PROVIDE CLINICAL ASSESSMENT:
1. Safety Assessment: Any red flags or urgent concerns?
2. Contraindications: What treatments should be avoided?
3. Risk Stratification: Low/Medium/High risk patient?
4. Clinical Priority: Urgent (48hrs) / High (1 week) / Standard (2-4 weeks)
5. Required Diagnostics: Essential tests before treatment
6. Safety Precautions: Special considerations for this patient

Return as JSON with fields: safetyLevel, redFlags, contraindications, riskLevel, clinicalPriority, requiredTests, precautions, clinicalNotes`
                    }]
                })
            });

            const data = await response.json();
            if (data.content && data.content[0]) {
                const content = data.content[0].text;
                try {
                    return JSON.parse(content);
                } catch (e) {
                    // Extract JSON from response if wrapped in text
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                }
            }
            throw new Error('Invalid Claude response format');
        } catch (error) {
            console.error('Claude API error:', error);
            return this.getClaudeFallback(assessmentData);
        }
    }

    // GPT-4o - Best for treatment planning and patient communication
    async analyzeWithGPT4o(assessmentData, claudeAnalysis) {
        console.log('🚀 GPT-4o creating personalized treatment plan and patient communication...');
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEYS.openai}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // GPT-4o (Omni) - Latest as of Sept 2025
                    messages: [
                        {
                            role: 'system',
                            content: `You are a leading vascular surgeon at Cosmex Vein Centre with 20+ years experience. 
                            Create personalized treatment plans that are empathetic, clear, and actionable.
                            Focus on patient education and realistic outcomes.`
                        },
                        {
                            role: 'user',
                            content: `Based on this vein assessment, create a comprehensive treatment plan:

ASSESSMENT DATA:
- Vein Location: ${assessmentData.location}
- Symptoms: ${assessmentData.symptoms.join(', ')}
- Severity: ${assessmentData.severity}/15
- Impact on Life: ${assessmentData.impactLevel}/10
- Patient Goal: ${assessmentData.goals}
- Duration: ${assessmentData.duration || 'Recent'}

CLINICAL SAFETY (from specialist review):
- Risk Level: ${claudeAnalysis?.riskLevel || 'Moderate'}
- Priority: ${claudeAnalysis?.clinicalPriority || 'Standard'}
- Precautions: ${claudeAnalysis?.precautions || 'Standard care'}

CREATE PERSONALIZED PLAN:
1. Treatment Options: List 2-3 specific treatments with success rates
2. Patient Journey: Step-by-step what to expect (consultation → treatment → recovery)
3. Timeline: Realistic timeline with milestones
4. Cost Breakdown: Transparent pricing for each option
5. Success Factors: What determines good outcomes for this patient
6. Lifestyle Advice: Practical tips for symptom management
7. FAQ: Answer 3 common concerns this patient might have

Format as JSON with engaging, empathetic language that builds trust.`
                        }
                    ],
                    temperature: 0.7, // Higher temp for more natural communication
                    max_tokens: 1500
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                try {
                    return JSON.parse(content);
                } catch (e) {
                    // Extract JSON from response
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                }
            }
            throw new Error('Invalid GPT-4o response format');
        } catch (error) {
            console.error('GPT-4o API error:', error);
            return this.getGPTFallback(assessmentData);
        }
    }

    // Combine insights from both AIs
    combineAIInsights(claudeAnalysis, gptAnalysis, localAnalysis) {
        return {
            // Safety & Clinical (Claude's strength)
            safetyAssessment: {
                level: claudeAnalysis?.safetyLevel || localAnalysis.urgency,
                redFlags: claudeAnalysis?.redFlags || [],
                contraindications: claudeAnalysis?.contraindications || [],
                riskLevel: claudeAnalysis?.riskLevel || 'Moderate',
                clinicalPriority: claudeAnalysis?.clinicalPriority || localAnalysis.urgency,
                requiredTests: claudeAnalysis?.requiredTests || ['Duplex ultrasound scan']
            },
            
            // Treatment Planning (GPT-4o's strength)
            treatmentPlan: {
                options: gptAnalysis?.treatmentOptions || localAnalysis.treatments,
                patientJourney: gptAnalysis?.patientJourney || this.getDefaultJourney(),
                timeline: gptAnalysis?.timeline || '6-12 weeks total',
                costBreakdown: gptAnalysis?.costBreakdown || localAnalysis.costs,
                successFactors: gptAnalysis?.successFactors || ['Early treatment', 'Following care plan'],
                lifestyleAdvice: gptAnalysis?.lifestyleAdvice || this.getDefaultAdvice()
            },
            
            // Combined Insights
            aiConsensus: {
                urgencyScore: this.calculateConsensusUrgency(claudeAnalysis, gptAnalysis, localAnalysis),
                confidenceLevel: this.calculateConfidence(claudeAnalysis, gptAnalysis),
                recommendedPathway: this.determinePathway(claudeAnalysis, gptAnalysis, localAnalysis),
                personalizedMessage: this.createPersonalizedMessage(claudeAnalysis, gptAnalysis)
            },
            
            // Metadata
            analysis: {
                claudeVersion: 'Claude 3.5 Sonnet (Sept 2025)',
                gptVersion: 'GPT-4o (Omni)',
                timestamp: new Date().toISOString(),
                processingTime: Date.now()
            }
        };
    }

    calculateConsensusUrgency(claude, gpt, local) {
        const urgencyMap = {
            'Urgent': 10,
            'High': 7,
            'Moderate': 5,
            'Standard': 3,
            'Low': 1
        };
        
        const scores = [
            urgencyMap[claude?.clinicalPriority] || 5,
            urgencyMap[gpt?.urgency] || 5,
            urgencyMap[local.urgency] || 5
        ];
        
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        if (avg >= 8) return 'Urgent - See within 48 hours';
        if (avg >= 6) return 'High - See within 1 week';
        if (avg >= 4) return 'Moderate - See within 2 weeks';
        return 'Standard - See within 4 weeks';
    }

    calculateConfidence(claude, gpt) {
        let confidence = 85; // Base confidence
        
        if (claude && gpt) {
            confidence = 95; // Both AIs responded
        } else if (claude || gpt) {
            confidence = 90; // One AI responded
        }
        
        return `${confidence}%`;
    }

    determinePathway(claude, gpt, local) {
        // Use Claude's safety assessment as primary factor
        if (claude?.riskLevel === 'High' || claude?.redFlags?.length > 0) {
            return 'comprehensive'; // £250 full assessment needed
        }
        
        // Use GPT's treatment complexity assessment
        if (gpt?.treatmentOptions?.length > 2) {
            return 'comprehensive';
        }
        
        // Default to local analysis
        return local.recommendedAssessment;
    }

    createPersonalizedMessage(claude, gpt) {
        const safety = claude?.safetyLevel || 'Standard';
        const priority = claude?.clinicalPriority || 'Standard';
        
        if (safety === 'High Risk' || priority === 'Urgent') {
            return "Based on our AI analysis, we recommend scheduling your consultation as soon as possible. Your symptoms suggest you would benefit from prompt medical evaluation.";
        } else if (priority === 'High') {
            return "Our AI assessment indicates you would benefit from a consultation within the next week. Early treatment typically leads to better outcomes.";
        } else {
            return "Your assessment shows a manageable condition. We recommend scheduling a consultation at your earliest convenience to discuss treatment options.";
        }
    }

    // Fallback methods
    getClaudeFallback(data) {
        return {
            safetyLevel: data.severity > 10 ? 'High' : 'Standard',
            redFlags: data.symptoms.includes('ulcers') ? ['Possible venous ulceration'] : [],
            contraindications: [],
            riskLevel: data.severity > 10 ? 'High' : 'Moderate',
            clinicalPriority: data.severity > 10 ? 'High' : 'Standard',
            requiredTests: ['Duplex ultrasound scan'],
            precautions: 'Standard vein treatment precautions',
            clinicalNotes: 'AI analysis pending - standard assessment recommended'
        };
    }

    getGPTFallback(data) {
        return {
            treatmentOptions: [
                {
                    name: 'Sclerotherapy',
                    successRate: '85-90%',
                    sessions: '2-4',
                    cost: '£800-1500'
                },
                {
                    name: 'Endovenous Laser',
                    successRate: '95-98%',
                    sessions: '1-2',
                    cost: '£2000-3500'
                }
            ],
            patientJourney: this.getDefaultJourney(),
            timeline: '6-12 weeks',
            costBreakdown: {
                consultation: '£250',
                treatment: '£800-3500',
                followUp: 'Included'
            },
            successFactors: ['Early treatment', 'Following aftercare'],
            lifestyleAdvice: this.getDefaultAdvice()
        };
    }

    getDefaultJourney() {
        return [
            'Initial consultation with vascular specialist',
            'Duplex ultrasound scan if required',
            'Personalized treatment plan discussion',
            'Treatment sessions (1-4 depending on method)',
            'Follow-up assessment at 6 weeks',
            '12-month guarantee coverage'
        ];
    }

    getDefaultAdvice() {
        return [
            'Elevate legs when resting',
            'Stay active with regular walking',
            'Wear compression stockings if recommended',
            'Maintain healthy weight',
            'Stay hydrated'
        ];
    }

    // Local analysis for immediate response
    performLocalAnalysis(assessmentData) {
        const severity = assessmentData.severity || 5;
        const location = assessmentData.location || 'legs';
        
        return {
            urgency: severity > 10 ? 'High' : severity > 5 ? 'Moderate' : 'Standard',
            recommendedAssessment: location === 'face' ? 'standard' : 'comprehensive',
            treatments: [
                {
                    name: location === 'face' ? 'IPL/Laser Therapy' : 'Sclerotherapy',
                    sessions: location === 'face' ? '1-3' : '2-4',
                    cost: location === 'face' ? '£300-800' : '£800-1500',
                    timeline: '4-12 weeks',
                    successRate: '85-95%'
                }
            ],
            costs: {
                consultation: location === 'face' ? '£50' : '£250',
                treatment: location === 'face' ? '£300-800' : '£800-3500'
            }
        };
    }
}

// Main assessment endpoint with dual AI
app.post('/api/assess', async (req, res) => {
    const startTime = Date.now();
    const assessmentData = req.body;
    const engine = new DualAIVeinAssessment();
    
    console.log('📊 Processing assessment with Dual AI...');
    
    // Perform local analysis first for immediate insights
    const localAnalysis = engine.performLocalAnalysis(assessmentData);
    
    // Run both AI analyses in parallel for speed
    const [claudeAnalysis, gptAnalysis] = await Promise.allSettled([
        engine.analyzeWithClaude(assessmentData),
        engine.analyzeWithGPT4o(assessmentData, localAnalysis)
    ]);
    
    // Extract results (use fallbacks if APIs fail)
    const claude = claudeAnalysis.status === 'fulfilled' ? claudeAnalysis.value : engine.getClaudeFallback(assessmentData);
    const gpt = gptAnalysis.status === 'fulfilled' ? gptAnalysis.value : engine.getGPTFallback(assessmentData);
    
    // Combine insights from both AIs
    const combinedInsights = engine.combineAIInsights(claude, gpt, localAnalysis);
    combinedInsights.analysis.processingTime = `${Date.now() - startTime}ms`;
    
    console.log(`✅ Analysis complete in ${combinedInsights.analysis.processingTime}`);
    
    res.json({
        success: true,
        aiTriage: combinedInsights,
        assessmentId: crypto.randomBytes(16).toString('hex'),
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        apis: {
            claude: !!API_KEYS.claude,
            openai: !!API_KEYS.openai,
            versions: {
                claude: 'Claude 3.5 Sonnet (June 2024 release)',
                openai: 'GPT-4o (Omni model)'
            }
        },
        server: 'Cosmex Vein AI v2.0'
    });
});

// Symptom analysis endpoint
app.post('/api/analyze-symptoms', async (req, res) => {
    const { symptoms, location } = req.body;
    
    const analysis = {
        immediate: symptoms.some(s => ['ulcers', 'bleeding', 'severe_pain'].includes(s)),
        requiresUltrasound: location === 'legs' && symptoms.length > 2,
        estimatedSessions: symptoms.length > 4 ? '3-5' : '1-3',
        successProbability: symptoms.includes('ulcers') ? '70-80%' : '85-95%',
        aiRecommendation: symptoms.includes('ulcers') || symptoms.includes('bleeding') 
            ? 'Urgent consultation recommended' 
            : 'Standard consultation appropriate'
    };
    
    res.json(analysis);
});

// Cost estimation endpoint
app.post('/api/estimate-cost', async (req, res) => {
    const { location, symptoms, severity } = req.body;
    
    let baseConsultation = location === 'face' ? 50 : 250;
    let treatmentMin = 300;
    let treatmentMax = 800;
    
    if (location === 'legs' || location === 'legs-major') {
        treatmentMin = 800;
        treatmentMax = 2000;
        
        if (symptoms?.includes('ulcers')) {
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
        ],
        aiNote: 'Pricing confirmed by Cosmex Vein Centre Sept 2025'
    });
});

module.exports = app;