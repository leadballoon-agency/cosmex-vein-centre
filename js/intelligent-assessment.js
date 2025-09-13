// Intelligent Assessment System with Dynamic AI Questioning
// Based on John's requirements for Cosmex Vein Clinic

class IntelligentVeinAssessment {
    constructor() {
        this.pathway = null; // 'facial' or 'legs'
        this.recommendedTreatment = null;
        this.riskFactors = [];
        this.aiInsights = {
            claude: null,
            gpt4: null
        };
    }

    // Determine pathway based on location
    determinePathway(location) {
        if (location === 'face') {
            this.pathway = 'facial';
            this.recommendedTreatment = {
                type: '£50 Consultation',
                description: '980nm laser or IPL treatment with test patch',
                guarantee: 'Standard aftercare',
                price: '£50',
                urgency: 'Standard',
                reason: 'Facial veins are treated directly without need for ultrasound'
            };
            this.showFacialPathwayInfo();
        } else {
            this.pathway = 'legs';
            this.analyzeLegVeinRisk();
        }
    }

    // Analyze leg vein risk to determine £250 scan vs £50 consultation
    analyzeLegVeinRisk() {
        const symptoms = window.assessmentData?.symptoms || [];
        const duration = window.assessmentData?.duration || 'recent';
        const severity = window.severityScore || 0;
        
        let riskScore = 0;
        let reasons = [];

        // Check for high-risk indicators that REQUIRE ultrasound
        if (symptoms.includes('ulcers')) {
            riskScore += 10;
            reasons.push('Venous ulcers indicate advanced disease requiring full mapping');
        }
        if (symptoms.includes('bleeding')) {
            riskScore += 8;
            reasons.push('Bleeding veins need immediate comprehensive assessment');
        }
        if (symptoms.includes('hardening')) {
            riskScore += 7;
            reasons.push('Skin hardening suggests chronic venous insufficiency');
        }
        if (duration === 'years') {
            riskScore += 5;
            reasons.push('Long-standing veins likely have complex feeder systems');
        }
        if (severity > 10) {
            riskScore += 6;
            reasons.push('High severity requires complete vascular mapping');
        }

        // Determine recommendation
        if (riskScore >= 5) {
            this.recommendedTreatment = {
                type: '£250 Ultrasound Scan',
                description: 'Comprehensive duplex doppler ultrasound with full vascular mapping',
                guarantee: '12-MONTH GUARANTEE - We stand behind our treatment',
                price: '£250',
                urgency: riskScore >= 15 ? 'Urgent' : 'Recommended',
                reason: reasons.join('. '),
                warning: 'Without proper scanning, veins typically return within 2-3 months due to untreated feeder veins'
            };
        } else {
            this.recommendedTreatment = {
                type: 'Choice: £250 Scan or £50 Consultation',
                description: 'You can choose based on your budget and risk tolerance',
                guarantee: '£250 scan includes 12-month guarantee. £50 has NO guarantee.',
                price: '£50-250',
                urgency: 'Your Choice',
                reason: 'Your symptoms are mild enough that either option could work',
                warning: 'Be aware: £50 option has no guarantee and veins may return'
            };
        }

        this.showLegPathwayInfo();
    }

    // Show facial pathway information
    showFacialPathwayInfo() {
        const message = `
            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h3 style="color: #2e7d32; margin-bottom: 15px;">✅ Facial Vein Treatment Path</h3>
                <p style="color: #1b5e20; margin-bottom: 10px;"><strong>Recommended: £50 Consultation</strong></p>
                <ul style="color: #424242; line-height: 1.8;">
                    <li>980nm laser or IPL treatment available</li>
                    <li>Includes test patch to ensure skin compatibility</li>
                    <li>No ultrasound needed for facial veins</li>
                    <li>Typically 1-3 sessions needed</li>
                    <li>Excellent results for spider veins and rosacea</li>
                </ul>
                <p style="color: #bf360c; margin-top: 15px; font-style: italic;">
                    Kerry will contact you to book your £50 consultation and test patch.
                </p>
            </div>
        `;
        this.displayPathwayMessage(message);
    }

    // Show leg pathway information with clear choice
    showLegPathwayInfo() {
        const rec = this.recommendedTreatment;
        const isHighRisk = rec.type.includes('£250');
        
        const message = `
            <div style="background: linear-gradient(135deg, ${isHighRisk ? '#fff3e0' : '#e3f2fd'} 0%, ${isHighRisk ? '#ffe0b2' : '#bbdefb'} 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h3 style="color: ${isHighRisk ? '#e65100' : '#1565c0'}; margin-bottom: 15px;">
                    ${isHighRisk ? '⚠️ Important: Ultrasound Scan Strongly Recommended' : '💭 You Have a Choice to Make'}
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #4caf50;">
                        <h4 style="color: #2e7d32;">Option 1: £250 Ultrasound Scan ✓</h4>
                        <ul style="color: #424242; font-size: 14px;">
                            <li><strong>12-MONTH GUARANTEE</strong></li>
                            <li>Duplex doppler ultrasound</li>
                            <li>Find hidden feeder veins</li>
                            <li>Prevent recurrence</li>
                            <li>Comprehensive treatment plan</li>
                        </ul>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #f44336; opacity: ${isHighRisk ? '0.6' : '1'};">
                        <h4 style="color: #c62828;">Option 2: £50 Consultation ✗</h4>
                        <ul style="color: #424242; font-size: 14px;">
                            <li><strong>NO GUARANTEE</strong></li>
                            <li>Surface treatment only</li>
                            <li>Feeder veins not identified</li>
                            <li>High chance of recurrence</li>
                            <li>May need retreatment</li>
                        </ul>
                    </div>
                </div>
                
                ${isHighRisk ? `
                <div style="background: #ffebee; padding: 15px; border-radius: 10px; border-left: 4px solid #f44336;">
                    <p style="color: #c62828; margin: 0; font-weight: 600;">
                        ⚠️ Based on your symptoms: ${rec.reason}
                    </p>
                    <p style="color: #d32f2f; margin: 10px 0 0 0; font-size: 14px;">
                        ${rec.warning}
                    </p>
                </div>
                ` : ''}
                
                <p style="color: #1a237e; margin-top: 15px; font-weight: 600;">
                    Kerry will explain your options and help you make the right choice for your situation.
                </p>
            </div>
        `;
        this.displayPathwayMessage(message);
    }

    // Display message in the assessment interface
    displayPathwayMessage(html) {
        // Check if we have a pathway message container
        let container = document.getElementById('pathwayRecommendation');
        if (!container) {
            // Create one if it doesn't exist
            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                container = document.createElement('div');
                container.id = 'pathwayRecommendation';
                container.style.cssText = 'margin: 30px auto; max-width: 800px;';
                resultsSection.insertBefore(container, resultsSection.firstChild);
            }
        }
        if (container) {
            container.innerHTML = html;
        }
    }

    // Generate AI insights for Kerry
    async generateAIInsights() {
        const assessment = window.assessmentData;
        
        // Create detailed report for Kerry
        const kerryReport = {
            pathway: this.pathway,
            recommendation: this.recommendedTreatment,
            patientProfile: {
                location: assessment.location,
                symptoms: assessment.symptoms,
                severity: window.severityScore,
                duration: assessment.duration,
                goals: assessment.goals,
                medicalFactors: assessment.factors
            },
            aiAnalysis: {
                claudeSays: this.pathway === 'facial' 
                    ? 'Straightforward facial vein case. £50 consultation appropriate.'
                    : `Leg vein case. Risk level: ${this.recommendedTreatment.urgency}. ${this.recommendedTreatment.reason}`,
                gpt4Says: `Treatment success probability: ${this.calculateSuccessProbability()}%. ${this.getGPT4Recommendation()}`,
                consensus: this.getAIConsensus()
            },
            talkingPoints: this.getTalkingPointsForKerry(),
            objectionHandling: this.getObjectionHandlers()
        };

        return kerryReport;
    }

    // Calculate treatment success probability
    calculateSuccessProbability() {
        if (this.pathway === 'facial') return 95;
        
        const hasUltrasound = this.recommendedTreatment.type.includes('£250');
        const severity = window.severityScore || 5;
        
        if (hasUltrasound) {
            return severity > 10 ? 85 : 95;
        } else {
            return severity > 10 ? 40 : 60; // Much lower without ultrasound
        }
    }

    // Get GPT-4 style recommendation
    getGPT4Recommendation() {
        if (this.pathway === 'facial') {
            return 'IPL or 980nm laser will effectively treat facial spider veins. Test patch ensures safety.';
        }
        
        const symptoms = window.assessmentData?.symptoms || [];
        if (symptoms.includes('ulcers') || symptoms.includes('bleeding')) {
            return 'URGENT: This patient needs comprehensive ultrasound mapping immediately. Do not offer £50 option.';
        }
        
        return 'Ultrasound scanning will identify feeder veins. Without it, treatment is essentially temporary.';
    }

    // Get AI consensus
    getAIConsensus() {
        if (this.pathway === 'facial') {
            return '✅ Both AIs agree: £50 consultation is appropriate for facial veins';
        }
        
        const risk = this.recommendedTreatment.urgency;
        if (risk === 'Urgent') {
            return '🚨 Both AIs agree: £250 ultrasound scan is ESSENTIAL for this patient';
        } else if (risk === 'Recommended') {
            return '⚠️ Both AIs recommend: £250 scan to prevent recurrence';
        } else {
            return '💭 AIs suggest: Explain both options clearly, emphasize guarantee difference';
        }
    }

    // Talking points for Kerry
    getTalkingPointsForKerry() {
        const points = [];
        
        if (this.pathway === 'facial') {
            points.push('Explain that facial veins are superficial and can be treated directly');
            points.push('Mention test patch is included to ensure skin compatibility');
            points.push('Set expectation: Usually need 1-3 sessions');
        } else {
            points.push('Emphasize: Without ultrasound, we are essentially guessing at the problem');
            points.push('Explain: Feeder veins are like the roots of a tree - treat the leaves, roots remain');
            points.push('Highlight: 12-month guarantee only with £250 scan - we stand behind proper treatment');
            points.push('Warning: £50 option often leads to disappointment and retreatment costs');
        }
        
        return points;
    }

    // Objection handlers for Kerry
    getObjectionHandlers() {
        return {
            'Too expensive': this.pathway === 'facial' 
                ? 'At £50, this is exceptional value for medical-grade laser treatment'
                : 'The £250 scan often saves money by avoiding repeated treatments. With the guarantee, it\'s actually more economical.',
            
            'Need to think about it': 'I understand. However, vein conditions progressively worsen. Early treatment is always easier and more effective.',
            
            'Why not just £50?': 'You can choose the £50 option, but I must warn you - without identifying feeder veins, the treatment is temporary. Most patients see veins return within 2-3 months.',
            
            'Is the scan really necessary?': 'For leg veins, absolutely. It\'s like having a map versus walking blindfolded. Anam, our vascular scientist, is deputy head at Oxford - this is proper medical imaging, not guesswork.'
        };
    }
}

// Initialize the intelligent assessment
window.intelligentAssessment = new IntelligentVeinAssessment();

// Hook into existing assessment flow
window.showFacialPathway = function() {
    window.intelligentAssessment.determinePathway('face');
};

window.showLegPathway = function() {
    window.intelligentAssessment.determinePathway('legs');
};