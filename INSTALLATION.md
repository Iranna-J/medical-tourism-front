# 📦 Installation & Deployment Guide

## 🚀 Quick Installation

### Prerequisites Check
```bash
# Check Node.js version (need v18+)
node --version

# Check npm version (need v9+)
npm --version

# If not installed, download from: https://nodejs.org/
```

### Install in 3 Commands
```bash
# 1. Navigate to project
cd medicalTourism-front

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Done!** Open http://localhost:5173

---

## 📋 Detailed Installation Steps

### Step 1: System Requirements

**Required:**
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- 2GB free disk space
- Modern web browser

**Recommended:**
- Node.js v20.x (LTS)
- npm v10.x
- 4GB RAM
- SSD storage

### Step 2: Install Node.js (if needed)

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs
```

**Windows:**
- Download installer from https://nodejs.org/
- Run installer
- Restart terminal

### Step 3: Clone/Navigate to Project
```bash
cd medicalTourism-front
```

### Step 4: Install Dependencies
```bash
npm install
```

This installs:
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- Tailwind CSS 3.4.17
- React Router 7.1.3
- Zustand 5.0.3
- Axios 1.7.9
- Lucide React 0.468.0
- React Hot Toast 2.4.1
- And more...

**Installation time:** ~2-3 minutes

### Step 5: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**.env contents:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 6: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.1.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 7: Verify Installation
1. Open browser: http://localhost:5173
2. You should see the home page
3. Check browser console for errors
4. Try navigating to different pages

---

## 🔧 Troubleshooting Installation

### Problem: npm install fails

**Solution 1: Clear cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Use different registry**
```bash
npm install --registry=https://registry.npmjs.org/
```

**Solution 3: Check permissions**
```bash
# Linux/macOS
sudo chown -R $USER ~/.npm
```

### Problem: Port 5173 already in use

**Solution 1: Kill process**
```bash
# Linux/macOS
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Solution 2: Use different port**
```bash
npm run dev -- --port 3000
```

### Problem: Module not found errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Problem: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript
npm run build
```

### Problem: Vite cache issues

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 🏗️ Build for Production

### Development Build
```bash
npm run dev
```
- Hot module replacement
- Source maps
- Development warnings
- Fast refresh

### Production Build
```bash
npm run build
```
- Minified code
- Optimized bundles
- Tree shaking
- No source maps

**Output:** `dist/` directory

**Build time:** ~30-60 seconds

**Bundle size:** ~150KB (gzipped)

### Preview Production Build
```bash
npm run preview
```
Opens production build at http://localhost:4173

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Steps:**
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts
4. Done! Your app is live

**Advantages:**
- Free tier available
- Automatic HTTPS
- Global CDN
- Zero configuration
- Automatic deployments

### Option 2: Netlify

**Steps:**
1. Build the app:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

**Advantages:**
- Free tier available
- Automatic HTTPS
- Form handling
- Serverless functions

### Option 3: AWS S3 + CloudFront

**Steps:**
1. Build the app:
```bash
npm run build
```

2. Install AWS CLI:
```bash
# macOS
brew install awscli

# Linux
sudo apt-get install awscli
```

3. Configure AWS:
```bash
aws configure
```

4. Create S3 bucket:
```bash
aws s3 mb s3://your-bucket-name
```

5. Upload files:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

6. Enable static website hosting
7. Configure CloudFront distribution

**Advantages:**
- Highly scalable
- Global CDN
- Full control
- Enterprise-grade

### Option 4: Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and run:**
```bash
# Build image
docker build -t medical-tourism-frontend .

# Run container
docker run -p 80:80 medical-tourism-frontend
```

**Advantages:**
- Consistent environment
- Easy scaling
- Portable
- Kubernetes ready

### Option 5: Traditional Server (Nginx)

**Steps:**
1. Build the app:
```bash
npm run build
```

2. Upload `dist/` to server:
```bash
scp -r dist/* user@server:/var/www/html/
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

4. Restart Nginx:
```bash
sudo systemctl restart nginx
```

**Advantages:**
- Full control
- No vendor lock-in
- Custom configuration
- Cost-effective

---

## 🔒 Production Configuration

### Environment Variables

**Production .env:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Security Headers

**Add to nginx.conf:**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### HTTPS Configuration

**Let's Encrypt (Free SSL):**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Performance Optimization

**Enable caching:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Enable compression:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

---

## 📊 Post-Deployment Checklist

### Functionality
- [ ] Home page loads
- [ ] All routes work
- [ ] Login/Register works
- [ ] API calls succeed
- [ ] Images load
- [ ] Forms submit
- [ ] Navigation works

### Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] Gzip enabled
- [ ] Caching configured
- [ ] CDN configured

### Security
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] CORS configured
- [ ] API keys secured
- [ ] No console errors

### SEO
- [ ] Meta tags present
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Analytics added
- [ ] Social media tags

### Mobile
- [ ] Responsive design works
- [ ] Touch targets adequate
- [ ] Forms usable
- [ ] Performance good
- [ ] PWA configured

---

## 🔄 Continuous Deployment

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📈 Monitoring

### Add Analytics

**Google Analytics:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

**Sentry:**
```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## 🆘 Support

### Getting Help
1. Check QUICK_START.md
2. Review SETUP_GUIDE.md
3. Check browser console
4. Review network tab
5. Contact development team

### Common Issues
- Backend not running
- CORS errors
- Environment variables not set
- Port conflicts
- Permission issues

---

## ✅ Installation Complete!

Your Medical Tourism Platform frontend is now installed and ready to deploy!

**Next Steps:**
1. Test locally
2. Configure production environment
3. Deploy to hosting
4. Monitor performance
5. Gather user feedback

**Happy Deploying! 🚀**
