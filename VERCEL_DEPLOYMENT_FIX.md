# Vercel 404 Error Fix Guide

## Changes Made

### 1. Updated `frontend/vercel.json`
- Added `version: 2` for Vercel platform version
- Added `routes` configuration for proper SPA routing
- Configured catch-all route to serve `index.html`

### 2. Updated `frontend/vite.config.js`
- Added `base: '/'` for proper asset paths
- Added `historyApiFallback: true` for client-side routing
- Configured build output directory

### 3. Created `frontend/public/_redirects`
- Added catch-all redirect rule for SPA support

## Vercel Dashboard Configuration

**IMPORTANT**: You need to verify these settings in your Vercel dashboard:

### Project Settings to Check:

1. **Root Directory**
   - Go to: Project Settings → General → Root Directory
   - Set to: `frontend`
   - This tells Vercel to deploy only the frontend folder

2. **Build & Development Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables** (if any)
   - Make sure all required environment variables are set
   - Check `.env.example` for required variables

## How to Fix in Vercel Dashboard

### Option 1: Set Root Directory (Recommended)
1. Go to your project in Vercel dashboard
2. Click "Settings"
3. Scroll to "Root Directory"
4. Click "Edit"
5. Enter: `frontend`
6. Click "Save"
7. Redeploy your project

### Option 2: Deploy Frontend as Separate Project
1. Create a new project in Vercel
2. Import only the `frontend` folder
3. Configure build settings as mentioned above

## Testing After Deployment

After redeployment, test these URLs:
- `https://your-domain.vercel.app/` - Should load home page
- `https://your-domain.vercel.app/quiz` - Should load quiz page
- `https://your-domain.vercel.app/results` - Should load results page
- Refresh any page - Should NOT show 404

## Common Issues

### Issue: Still getting 404
**Solution**: The root directory is not set correctly in Vercel
- Set Root Directory to `frontend` in project settings

### Issue: Build fails
**Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Check for environment variable issues

### Issue: Assets not loading
**Solution**: Check the base URL in vite.config.js
- Should be `base: '/'` for root deployment
- Update if deploying to a subdirectory

## Manual Deployment Steps

If automatic deployment doesn't work:

1. Build locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Deploy the `dist` folder:
   - Use Vercel CLI: `vercel --prod`
   - Or drag and drop the `dist` folder in Vercel dashboard

## Next Steps

1. ✅ Code changes are committed and pushed
2. ⏳ Wait for Vercel to redeploy (2-3 minutes)
3. 🔍 Check Vercel dashboard for deployment status
4. ⚙️ Verify Root Directory is set to `frontend`
5. 🧪 Test all routes after deployment

## Support

If issues persist:
1. Check Vercel deployment logs
2. Verify build output in Vercel dashboard
3. Ensure `dist` folder contains `index.html`
4. Check browser console for errors
