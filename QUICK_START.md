# ⚡ Quick Start Guide - Medical Tourism Frontend

## 🚀 Get Running in 3 Minutes

### Step 1: Install (1 minute)
```bash
cd medicalTourism-front
npm install
```

### Step 2: Configure (30 seconds)
```bash
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env
```

### Step 3: Run (30 seconds)
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: **http://localhost:5173**

---

## ✅ Verify Everything Works

### 1. Home Page
- ✅ Page loads without errors
- ✅ Search bar is visible
- ✅ Navigation menu works
- ✅ Footer displays

### 2. Navigation
- ✅ Click "Hospitals" → See hospital listing
- ✅ Click "Doctors" → See doctor listing
- ✅ Click "Get Started" → See registration form

### 3. Authentication
- ✅ Register a new account
- ✅ Login with credentials
- ✅ See user name in navbar
- ✅ Logout works

---

## 🎯 Test the Key Features

### Test Hospital Listing
1. Click "Hospitals" in navbar
2. Should see grid of hospital cards
3. Try pagination (if available)
4. Search should be visible

### Test Doctor Listing
1. Click "Doctors" in navbar
2. Should see grid of doctor cards
3. Try pagination (if available)
4. Search should be visible

### Test Authentication Flow
1. Click "Get Started"
2. Fill registration form
3. Submit and verify redirect
4. Logout
5. Login again
6. Verify dashboard access

---

## 🐛 Quick Troubleshooting

### Problem: npm install fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problem: Port 5173 already in use
**Solution:**
```bash
# Use different port
npm run dev -- --port 3000
```

### Problem: Backend connection fails
**Solution:**
1. Check backend is running: `http://localhost:8080/api`
2. Verify `.env` file exists
3. Check CORS is enabled in backend

### Problem: Page is blank
**Solution:**
1. Check browser console for errors
2. Clear browser cache
3. Restart dev server

---

## 📦 What's Included

### ✅ Working Features
- Home page with search
- Hospital listing with pagination
- Doctor listing with pagination
- User registration
- User login/logout
- Responsive navigation
- Toast notifications
- Loading states
- Error handling

### 🎨 UI Components
- Navbar (desktop + mobile)
- Footer
- Hospital cards
- Doctor cards
- Form inputs
- Buttons (3 variants)
- Loading spinners
- Toast notifications

### 🔧 Technical Setup
- React 19 + TypeScript
- Vite build tool
- Tailwind CSS
- React Router
- Zustand state management
- Axios HTTP client
- JWT authentication

---

## 📝 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🎨 Customization Quick Tips

### Change Brand Name
Edit `src/components/Navbar.tsx` and `src/components/Footer.tsx`:
```tsx
<span className="text-2xl font-bold">YourBrand</span>
```

### Change Primary Color
Edit `tailwind.config.js`:
```javascript
primary: {
  600: '#YOUR_COLOR',
}
```

### Change API URL
Edit `.env`:
```
VITE_API_BASE_URL=http://your-api-url/api
```

---

## 📚 File Structure Quick Reference

```
src/
├── components/       # UI components
├── pages/           # Route pages
├── services/        # API calls
├── store/           # State management
├── types/           # TypeScript types
├── config/          # Configuration
└── App.tsx          # Main app
```

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger Docs**: http://localhost:8080/swagger-ui.html

---

## 🎯 Next Steps

1. ✅ **You're running!** - Frontend is working
2. 📖 **Read FEATURES.md** - See what's implemented
3. 🛠️ **Read SETUP_GUIDE.md** - Detailed setup info
4. 🚀 **Start building** - Add new features

---

## 💡 Pro Tips

1. **Keep backend running** - Frontend needs API
2. **Use browser DevTools** - Check Network tab for API calls
3. **Check console** - Look for errors
4. **Hot reload works** - Changes appear instantly
5. **Use TypeScript** - Get type safety and autocomplete

---

## 🆘 Need Help?

### Check These First:
1. Is backend running? → `http://localhost:8080/api`
2. Is .env file created? → Check `.env` exists
3. Are dependencies installed? → Run `npm install`
4. Any console errors? → Check browser console

### Still Stuck?
- Read `SETUP_GUIDE.md` for detailed instructions
- Read `README.md` for full documentation
- Check `FEATURES.md` for feature list

---

## 🎉 You're All Set!

Your Medical Tourism Platform frontend is running!

**Happy Coding! 🚀**

---

## 📊 Quick Status Check

Run this checklist:
- [ ] npm install completed
- [ ] .env file created
- [ ] npm run dev started
- [ ] Browser opened to localhost:5173
- [ ] Home page loads
- [ ] Navigation works
- [ ] Can register/login
- [ ] Hospitals page loads
- [ ] Doctors page loads

**All checked?** You're ready to go! 🎊
