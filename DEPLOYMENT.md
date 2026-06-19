# Deployment Guide for ExpenseLedger

## Quick Deploy to Vercel

ExpenseLedger is optimized for Vercel deployment. Follow these steps:

### Prerequisites
- GitHub account with the repository
- Vercel account (free tier available at vercel.com)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the ExpenseLedger repository from GitHub
4. Select the repository: `silven-mohan/Expenses.io`

### Step 2: Configure Project

**Framework**: Next.js (auto-detected)

**Build and Output Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables** (Optional):
```
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app is live! 🎉

## Post-Deployment

### Enable PWA Features
The app is already configured as a PWA. Users can install it from the browser menu:
- Desktop: Menu → "Install ExpenseLedger"
- Mobile: Share → "Add to Home Screen"

### Performance Optimizations
- ✅ Image optimization enabled
- ✅ Code splitting configured
- ✅ PWA caching strategy active
- ✅ Security headers included

### Monitoring

Vercel provides built-in monitoring:
1. Dashboard → Your Project
2. Monitor real-time analytics
3. Check deployment logs

## Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

```env
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

## Troubleshooting

### Build Fails
- Check Node.js version (18.x required)
- Clear Vercel cache: Settings → Deployment Protection
- Verify all dependencies are listed in package.json

### PWA Not Working
- Clear browser cache
- Verify manifest.json is accessible
- Check service worker in DevTools

### Database Issues (Client-side only)
- Clear IndexedDB in browser DevTools
- Re-initialize by visiting the app
- No backend database needed

## Performance Tips

1. **Enable Static Generation** where possible
2. **Use Incremental Static Regeneration** for reports
3. **Monitor Core Web Vitals** in Vercel Analytics
4. **Compress assets** with Vercel's built-in optimization

## Rollback

If needed, rollback to a previous deployment:
1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Click "Promote to Production"

## CI/CD Pipeline

Vercel automatically:
- Deploys on push to main
- Creates preview for pull requests
- Runs security scans
- Optimizes images

## SSL/TLS

Automatically enabled by Vercel. Your site is secure by default.

## Analytics

View usage statistics:
1. Project Dashboard → Analytics
2. Monitor:
   - Page views
   - Core Web Vitals
   - Error rates
   - Response times

## Support

For Vercel-specific issues:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

For ExpenseLedger issues:
- [GitHub Issues](https://github.com/silven-mohan/Expenses.io/issues)

---

**Your app is now live and ready to use!** 🚀
