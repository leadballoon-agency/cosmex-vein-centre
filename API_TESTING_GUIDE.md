# API Testing Guide - Fix AI Integration

## Quick Fix Steps

### 1. Test the API (Do this first!)
Open in your browser: `https://cosmex-vein-centre.vercel.app/test-api.html`

This test page will:
- Check if the API is accessible
- Verify if AI keys are configured
- Show you exactly what's working/not working

### 2. Check Browser Console
1. Open the main site: `https://cosmex-vein-centre.vercel.app`
2. Press F12 to open Developer Tools
3. Click on "Console" tab
4. Click "Start Your Assessment"
5. Complete the assessment
6. Look for messages starting with:
   - 🚀 Starting AI assessment
   - 📡 Calling API
   - ✅ AI Response received (if working)
   - ❌ Error (if failing)

### 3. Verify Environment Variables on Vercel
1. Go to: https://vercel.com/dashboard
2. Click on your "cosmex-vein-centre" project
3. Go to "Settings" tab
4. Click "Environment Variables" on the left
5. Make sure these are set:
   - `CLAUDE_API_KEY` (your Claude API key)
   - `OPENAI_API_KEY` (your OpenAI API key)

### 4. What the Debug Messages Mean

#### If you see "API Status: Using Fallback"
- The API is working but using simulated responses
- API keys are not configured or invalid
- Fix: Add/update environment variables on Vercel

#### If you see "404 Error"
- API endpoints not deployed properly
- Fix: Redeploy on Vercel

#### If you see "CORS Error"
- Cross-origin issue (now fixed with updated vercel.json)
- Should be resolved after latest deployment

## Current Status

I've added:
1. ✅ Comprehensive debugging to track API calls
2. ✅ Test page to verify API functionality
3. ✅ Updated vercel.json for proper API routing
4. ✅ CORS headers configuration

## The AI Should Now Work If:
1. Environment variables are set on Vercel
2. The deployment is successful
3. API keys are valid

## Testing the Full Flow
1. Open the test page first
2. Click "Test Assessment API"
3. If it shows "Online" - the AI is working!
4. If it shows "Using Fallback" - API keys need to be added
5. If it shows "Error" - deployment issue

## Need More Help?
The test page will tell you exactly what's wrong and how to fix it.