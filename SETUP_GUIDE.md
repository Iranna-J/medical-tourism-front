# 🚀 Medical Tourism Platform - Frontend Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd medicalTourism-front
npm install
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env if your backend runs on a different port
# Default: VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: `http://localhost:5173`

---

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Backend API**: Running on port 8080

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 🔧 Detailed Setup

### 1. Clone & Navigate
```bash
cd medicalTourism-front
```

### 2. Install All Dependencies
```bash
npm install
```

This installs:
- React 19
- TypeScript
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)
- React Hot Toast (notifications)

### 3. Environment Configuration

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

**Important**: Make sure your backend is running on port 8080!

### 4. Start Development
```bash
npm run dev
```

You should see:
```
  VITE v7.1.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎯 First Time Usage

### 1. Access the Application
Open `http://localhost:5173` in your browser

### 2. Register a New Account
- Click "Get Started" or "Sign up"
- Fill in your details
- Select role (Patient/Doctor)
- Click "Create Account"

### 3. Login
- Use your registered email and password
- Click "Sign In"

### 4. Explore Features
- Browse hospitals
- Search for doctors
- View treatments
- Access your dashboard

---

## 🏗️ Project Structure Explained

```
medicalTourism-front/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.tsx    # Top navigation
│   │   ├── Footer.tsx    # Bottom footer
│   │   ├── HospitalCard.tsx
│   │   └── DoctorCard.tsx
│   ├── pages/            # Route pages
│   │   ├── Home.tsx      # Landing page
│   │   ├── Login.tsx     # Login page
│   │   ├── Register.tsx  # Registration
│   │   ├── Hospitals.tsx # Hospital listing
│   │   └── Doctors.tsx   # Doctor listing
│   ├── services/         # API calls
│   │   ├── authService.ts
│   │   ├── hospitalService.ts
│   │   └── doctorService.ts
│   ├── store/            # State management
│   │   └── authStore.ts  # Auth state
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── config/           # Configuration
│   │   └── api.ts        # Axios setup
│   ├── App.tsx           # Main component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

---

## 🎨 Customization

### Change Primary Color

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Change this
    600: '#0284c7',  // And this
    // ...
  }
}
```

### Change Logo/Branding

Edit `src/components/Navbar.tsx` and `src/components/Footer.tsx`:
```tsx
<span className="text-2xl font-bold">YourBrand</span>
```

### Add New Pages

1. Create page in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

---

## 🔌 API Integration

### Backend Connection

The frontend connects to your Spring Boot backend via:
```typescript
// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Available Services

1. **authService** - Login, Register, Get Current User
2. **hospitalService** - Get Hospitals, Search, Filter
3. **doctorService** - Get Doctors, Search by Specialty
4. **searchService** - Quick Search, Advanced Search

### Adding New API Calls

Create a new service file:
```typescript
// src/services/treatmentService.ts
import api from '../config/api';

export const treatmentService = {
  getAll: async () => {
    const response = await api.get('/treatments');
    return response.data;
  },
};
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Backend Connection Failed
1. Check backend is running: `http://localhost:8080/api`
2. Verify `.env` has correct URL
3. Check CORS is enabled in backend

### Dependencies Installation Failed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📦 Production Build

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Deploy to Server

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to your server**

3. **Configure web server (Nginx example):**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/dist;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Home page loads
- [ ] Navigation works
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Hospital listing loads
- [ ] Doctor listing loads
- [ ] Search functionality works
- [ ] Responsive on mobile
- [ ] Toast notifications appear

---

## 📱 Mobile Development

### Test on Mobile

1. **Find your local IP:**
   ```bash
   ifconfig | grep "inet "
   ```

2. **Start dev server with host:**
   ```bash
   npm run dev -- --host
   ```

3. **Access from mobile:**
   ```
   http://YOUR_IP:5173
   ```

---

## 🔐 Security Notes

- JWT tokens stored in localStorage
- Automatic token refresh on API calls
- Auto-logout on 401 responses
- HTTPS recommended for production
- Environment variables for sensitive data

---

## 📊 Performance Tips

1. **Lazy load routes:**
   ```tsx
   const Home = lazy(() => import('./pages/Home'));
   ```

2. **Optimize images:**
   - Use WebP format
   - Compress images
   - Use CDN

3. **Enable caching:**
   - Configure service worker
   - Use React.memo for components

---

## 🆘 Common Issues

### "Cannot find module" errors
```bash
npm install
```

### Tailwind styles not working
```bash
# Restart dev server
npm run dev
```

### API calls failing
1. Check backend is running
2. Verify CORS settings
3. Check network tab in browser DevTools

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🎉 You're All Set!

Your frontend is now ready to use. Start building amazing features!

**Need help?** Check the main README.md or contact the development team.

---

**Happy Coding! 🚀**
