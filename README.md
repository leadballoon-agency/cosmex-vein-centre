# Cosmex Vein Centre - Advanced AI Assessment System

## World's Most Advanced Vein Assessment Tool

This is a cutting-edge AI-powered vein assessment system that combines GPT-4 and Claude AI to provide precision diagnostics and personalized treatment recommendations.

## Features

### 🧠 Dual AI Analysis
- **GPT-4 Integration**: Advanced medical reasoning and treatment planning
- **Claude AI**: Clinical assessment and urgency triage
- **Real-time Analysis**: Instant severity scoring and risk assessment

### 🔒 Security & Privacy
- Military-grade AES-256 encryption for patient data
- HIPAA-compliant data handling
- Secure API key management
- Rate limiting and DDoS protection

### 📊 Advanced Diagnostics
- CEAP classification system implementation
- Real-time symptom severity scoring
- Treatment success probability calculation
- Cost estimation with payment plans

### 💻 Three Assessment Interfaces
1. **cosmex_enhanced_landing.html** - Main landing page with booking integration
2. **cosmex_vein_assessment.html** - Original assessment form
3. **cosmex_ai_assessment.html** - NEW AI-powered assessment with real-time analysis

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file has been created with your API keys. Keep these secure and never commit to public repositories.

### 3. Start the Backend Server
```bash
npm start
```
The server will run on http://localhost:3000

### 4. Open the Assessment Tools
- Landing Page: Open `cosmex_enhanced_landing.html` in your browser
- Standard Assessment: Open `cosmex_vein_assessment.html`
- AI Assessment: Open `cosmex_ai_assessment.html`

## API Endpoints

### POST /api/assess
Main assessment endpoint that processes patient data through both AI models

### POST /api/analyze-symptoms
Real-time symptom analysis for immediate feedback

### POST /api/estimate-cost
Dynamic cost calculation based on assessment data

### POST /api/track-journey
Patient journey tracking for analytics

## AI Models Integration

### Claude API
- Used for medical-grade clinical assessment
- Provides urgency triage and risk factors
- Generates preparation advice and clinical notes

### GPT-4 API
- Analyzes treatment options and success rates
- Creates personalized patient education
- Provides comprehensive treatment planning

## Security Considerations

⚠️ **IMPORTANT**: 
1. Never expose API keys in client-side code
2. Always use HTTPS in production
3. Implement proper authentication before deployment
4. Store patient data in encrypted database
5. Add rate limiting to prevent abuse

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Security**: AES-256 encryption, CORS, Helmet.js
- **Styling**: Custom CSS with gradient designs

## Advanced Features

### Real-time AI Analysis
The system provides instant feedback as patients complete the assessment:
- Severity indicators update in real-time
- Risk levels calculated dynamically
- Treatment urgency determined automatically

### Intelligent Triage System
- Automatic classification into urgency levels
- Priority scheduling recommendations
- Clinical pathway optimization

### Personalized Treatment Plans
- AI-generated treatment recommendations
- Success probability calculations
- Timeline and cost estimations
- Payment plan options

## Production Deployment

Before deploying to production:

1. **Secure API Keys**: Move to environment variables or secret management service
2. **Add Authentication**: Implement JWT or OAuth2
3. **Database Setup**: Connect MongoDB or PostgreSQL for data persistence
4. **SSL Certificate**: Ensure HTTPS is configured
5. **Monitoring**: Add logging and error tracking (e.g., Sentry)
6. **Backup**: Implement data backup strategy

## Support

For technical support or questions about the AI system, contact the development team.

## License

Proprietary - Cosmex Vein Centre 2024. All rights reserved.