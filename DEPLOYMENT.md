# Deployment Guide

This guide covers deploying both the frontend and backend to production.

## Prerequisites

- [ ] PayHero account with API credentials
- [ ] Supabase project with all tables created
- [ ] Domain name (optional but recommended)
- [ ] Git repository (GitHub, GitLab, etc.)

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - Go to project settings
   - Add your domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```
   - Click "Deploy site"

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Prepare server for deployment**
   ```bash
   cd server
   ```

2. **Deploy to Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` directory as root
   - Railway will auto-detect Node.js

3. **Configure Environment Variables**
   ```
   PORT=3000
   PAYHERO_USERNAME=your_username
   PAYHERO_API_PASSWORD=your_password
   PAYHERO_CHANNEL_ID=your_channel_id
   CALLBACK_URL=https://yourapp.railway.app/api/callback
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

4. **Get your Railway URL**
   - Copy the generated URL (e.g., `https://yourapp.railway.app`)
   - Update `CALLBACK_URL` to match

5. **Update Frontend**
   - Update your frontend code to use the Railway URL
   - In `PaymentPage.tsx`, update the fetch URL:
   ```typescript
   const response = await fetch('https://yourapp.railway.app/api/pay', {
     // ...
   });
   ```

### Option 2: Render

1. **Create render.yaml** in server directory:
   ```yaml
   services:
     - type: web
       name: earning-system-api
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: PORT
           value: 3000
         - key: PAYHERO_USERNAME
           sync: false
         - key: PAYHERO_API_PASSWORD
           sync: false
         - key: PAYHERO_CHANNEL_ID
           sync: false
         - key: CALLBACK_URL
           sync: false
         - key: SUPABASE_URL
           sync: false
         - key: SUPABASE_SERVICE_KEY
           sync: false
   ```

2. **Deploy**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory
   - Render will use the render.yaml config
   - Add your environment variables
   - Deploy

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set PAYHERO_USERNAME=your_username
   heroku config:set PAYHERO_API_PASSWORD=your_password
   heroku config:set PAYHERO_CHANNEL_ID=your_channel_id
   heroku config:set CALLBACK_URL=https://your-app-name.herokuapp.com/api/callback
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_SERVICE_KEY=your_service_role_key
   ```

4. **Create Procfile** in server directory:
   ```
   web: node index.js
   ```

5. **Deploy**
   ```bash
   cd server
   git init
   git add .
   git commit -m "Deploy to Heroku"
   heroku git:remote -a your-app-name
   git push heroku main
   ```

## Post-Deployment Configuration

### 1. Update PayHero Callback URL

- Log in to PayHero dashboard
- Go to Settings → API
- Update callback URL to: `https://your-backend-url/api/callback`
- Save changes

### 2. Test Payment Flow

1. Create a test account on your deployed frontend
2. Try to pay the KES 500 activation fee
3. Monitor backend logs for PayHero callbacks
4. Verify user activation and commission distribution

### 3. Update Frontend API Endpoints

If you hardcoded any API URLs, update them to point to your production backend:

```typescript
// Change from
const API_URL = 'http://localhost:3000/api';

// To
const API_URL = 'https://your-backend-url/api';
```

Or use environment variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

And add to your frontend env vars:
```
VITE_API_URL=https://your-backend-url/api
```

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enabled on all deployments
- [ ] PayHero credentials are not exposed in frontend
- [ ] Service role key is only used in backend
- [ ] CORS is properly configured
- [ ] Callback URL is secured (consider adding signature verification)

## Monitoring & Logs

### Frontend (Vercel/Netlify)
- Access logs through their dashboard
- Set up error tracking (Sentry, LogRocket)

### Backend (Railway/Render/Heroku)
- View logs in platform dashboard
- Set up log aggregation (Papertrail, Logtail)
- Monitor uptime (UptimeRobot)

### Database (Supabase)
- Monitor usage in Supabase dashboard
- Set up alerts for high usage
- Enable database backups

## Scaling Considerations

### When to Scale

- **Frontend**: Automatically scales with Vercel/Netlify
- **Backend**: Upgrade when you see:
  - High CPU usage (>80%)
  - Slow response times (>2s)
  - Memory issues
  - 500+ concurrent users

### Scaling Options

1. **Horizontal Scaling**
   - Add more backend instances
   - Use load balancer

2. **Vertical Scaling**
   - Upgrade to larger dyno/instance
   - Increase memory/CPU

3. **Database Optimization**
   - Add indexes on frequently queried columns
   - Optimize slow queries
   - Consider read replicas

## Backup Strategy

### Database Backups
- Enable automatic backups in Supabase
- Schedule: Daily
- Retention: 7 days minimum

### Code Backups
- Keep code in Git repository
- Tag releases: `git tag v1.0.0`
- Push tags: `git push --tags`

## Rollback Plan

If deployment fails:

1. **Frontend**: Vercel/Netlify allow instant rollback to previous deployment
2. **Backend**:
   ```bash
   git revert HEAD
   git push
   ```
3. **Database**: Restore from Supabase backup

## Cost Estimates

### Free Tier (Good for testing)
- Supabase: Free (500MB database, 50k monthly active users)
- Vercel: Free (100GB bandwidth/month)
- Railway: Free ($5 credit/month)
- **Total: $0/month**

### Starter (Up to 1000 users)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Railway: $10-20/month
- **Total: ~$60/month**

### Growth (Up to 10,000 users)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Railway: $50/month
- PayHero: Transaction fees only
- **Total: ~$100/month**

## Troubleshooting

### Payment callbacks not received
- Verify callback URL is publicly accessible
- Check PayHero dashboard for failed callbacks
- Review backend logs for errors

### Database connection errors
- Verify Supabase service key is correct
- Check IP restrictions in Supabase settings
- Ensure connection pooling is configured

### Build failures
- Clear cache and rebuild
- Check node version compatibility
- Verify all dependencies are installed

## Support Resources

- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- PayHero: https://payhero.co.ke/docs

## Final Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] PayHero callback URL updated
- [ ] Payment flow tested end-to-end
- [ ] User registration tested
- [ ] Referral system tested
- [ ] Admin workflows tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Error tracking enabled

## Going Live

Once everything is tested and working:

1. Announce to your team
2. Share referral links
3. Monitor closely for first 24 hours
4. Be ready to handle support requests
5. Iterate based on user feedback

Congratulations! Your earning system is now live! 🎉
