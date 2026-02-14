# Deploy Your Website

Your website is ready to go live! Here are the easiest ways to deploy:

## Option 1: Deploy to Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if you don't have it):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts. It will ask you to:
   - Login to Vercel (or create an account)
   - Confirm project settings
   - Deploy

3. **That's it!** Your site will be live at a URL like `your-site.vercel.app`

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy via Vercel Website (No CLI needed)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your Git repository (push to GitHub first)
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"

## Option 3: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy
   ```
   For production:
   ```bash
   netlify deploy --prod
   ```

## Option 4: Deploy to GitHub Pages

1. Push your code to GitHub
2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
4. Run:
   ```bash
   npm run deploy
   ```

## Before Deploying

Make sure to:
1. Commit your code to Git
2. Push to GitHub (if using GitHub-based deployment)
3. Test the build locally: `npm run build`

## Custom Domain

After deployment, you can add a custom domain in your hosting platform's settings.

