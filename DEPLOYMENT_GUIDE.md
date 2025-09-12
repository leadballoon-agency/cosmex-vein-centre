# 🚀 Deployment Guide - Cosmex Vein AI Assessment System

## Quick Deployment Options (Easiest to Advanced)

---

## Option 1: Vercel (Easiest - 5 minutes) ⭐ RECOMMENDED

### Step 1: Prepare for Vercel
```bash
# Create a new file for Vercel deployment
touch vercel.json
```

### Step 2: Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "vein_ai_backend.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "vein_ai_backend.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Step 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Create new project
# - Link to your account
# - Deploy
```

### Step 4: Add Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `CLAUDE_API_KEY`
   - `OPENAI_API_KEY`

**Live in 5 minutes at: https://your-project.vercel.app**

---

## Option 2: Netlify + Netlify Functions (Easy - 10 minutes)

### Step 1: Prepare for Netlify
```bash
# Create netlify.toml
touch netlify.toml

# Create functions folder
mkdir netlify/functions
```

### Step 2: Create netlify.toml
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Step 3: Convert backend to Netlify Functions
```bash
# Move backend to functions folder
cp vein_ai_backend.js netlify/functions/api.js
```

### Step 4: Deploy
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

**Live at: https://your-site.netlify.app**

---

## Option 3: Railway (Professional - 15 minutes) 🏆 BEST FOR PRODUCTION

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Prepare Project
```bash
# Create start script in package.json
# Already done ✓

# Create Procfile
echo "web: node vein_ai_backend.js" > Procfile
```

### Step 3: Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link and deploy
railway up

# Add environment variables
railway variables add CLAUDE_API_KEY="your-key"
railway variables add OPENAI_API_KEY="your-key"
```

**Live with SSL at: https://your-app.railway.app**

---

## Option 4: Heroku (Traditional - 20 minutes)

### Step 1: Prepare for Heroku
```bash
# Create Procfile
echo "web: node vein_ai_backend.js" > Procfile

# Initialize git if not already
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create Heroku App
```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create cosmex-vein-ai

# Add buildpack
heroku buildpacks:set heroku/nodejs
```

### Step 3: Configure Environment
```bash
# Set environment variables
heroku config:set CLAUDE_API_KEY="your-key"
heroku config:set OPENAI_API_KEY="your-key"
heroku config:set NODE_ENV=production
```

### Step 4: Deploy
```bash
# Deploy
git push heroku main

# Open app
heroku open
```

**Live at: https://cosmex-vein-ai.herokuapp.com**

---

## Option 5: AWS (Enterprise - 30 minutes)

### Using AWS Amplify (Easiest AWS option)

```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Configure AWS
amplify configure

# Initialize project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js cosmex-vein-ai

# Create environment
eb create production

# Set environment variables
eb setenv CLAUDE_API_KEY=your-key OPENAI_API_KEY=your-key

# Deploy
eb deploy
```

---

## Option 6: Google Cloud Run (Scalable - 25 minutes)

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "vein_ai_backend.js"]
```

### Step 2: Deploy to Cloud Run
```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Build and deploy
gcloud run deploy cosmex-vein-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars CLAUDE_API_KEY=your-key,OPENAI_API_KEY=your-key
```

---

## 🌐 Domain Setup (For All Platforms)

### Step 1: Buy Domain
- GoDaddy: https://godaddy.com
- Namecheap: https://namecheap.com
- Google Domains: https://domains.google

### Step 2: Connect Domain
**For Vercel:**
1. Go to project settings
2. Add domain
3. Update DNS records as shown

**For Netlify:**
1. Go to Domain settings
2. Add custom domain
3. Update nameservers

**For Railway/Heroku:**
1. Add custom domain in settings
2. Create CNAME record pointing to app URL

---

## 📱 Post-Deployment Checklist

### Security
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Add authentication (if needed)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Configure uptime monitoring (UptimeRobot)

### Performance
- [ ] Enable caching
- [ ] Compress assets
- [ ] Optimize images
- [ ] Set up CDN (Cloudflare)

---

## 🔧 Quick Fixes for Common Issues

### CORS Errors
```javascript
// In vein_ai_backend.js, update CORS:
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

### API Key Security
```javascript
// Never expose keys in frontend!
// Always use backend proxy
```

### Port Issues
```javascript
// Update in vein_ai_backend.js:
const PORT = process.env.PORT || 3000;
```

---

## 💰 Estimated Costs

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| Vercel | Free-$20 | Quick prototypes |
| Netlify | Free-$19 | Static + Functions |
| Railway | $5-20 | Production apps |
| Heroku | $7-50 | Traditional hosting |
| AWS | $10-100+ | Enterprise scale |
| Google Cloud | $10-100+ | Auto-scaling needs |

---

## 🚨 Emergency Deployment (2 minutes)

**Fastest option using GitHub Pages (frontend only):**

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git push origin gh-pages

# Enable GitHub Pages in repo settings
# Live at: https://username.github.io/repo-name
```

**Note:** This only hosts HTML files, not the backend API.

---

## 📞 Need Help?

1. **Vercel Support**: https://vercel.com/support
2. **Railway Discord**: https://discord.gg/railway
3. **Stack Overflow**: Tag with `node.js` and `deployment`

---

## ✅ Recommended Production Setup

**For Cosmex Vein Centre, I recommend:**

1. **Frontend**: Vercel (free, fast CDN)
2. **Backend API**: Railway ($5/month, reliable)
3. **Domain**: Cloudflare registrar ($10/year)
4. **Monitoring**: Sentry (free tier)
5. **Analytics**: Google Analytics (free)

**Total Cost: ~$15/month for professional deployment**

---

## 🎯 Next Steps

1. Choose your platform (Railway recommended)
2. Deploy backend first
3. Update API URLs in HTML files
4. Deploy frontend
5. Test everything
6. Add monitoring
7. Go live! 🚀