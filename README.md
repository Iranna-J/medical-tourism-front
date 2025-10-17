# Medical Tourism Platform - Frontend

A modern, responsive React + TypeScript frontend for the Medical Tourism Platform.

## 🚀 Features

- **Modern UI/UX** - Clean, professional design inspired by leading medical tourism platforms
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Authentication** - Secure login and registration with JWT
- **Hospital Search** - Browse and search accredited hospitals
- **Doctor Profiles** - Find and connect with expert doctors
- **Treatment Catalog** - Explore available medical treatments
- **Real-time Updates** - Toast notifications for user feedback
- **Type Safety** - Full TypeScript support

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HospitalCard.tsx
│   └── DoctorCard.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Hospitals.tsx
│   └── Doctors.tsx
├── services/           # API service layer
│   ├── authService.ts
│   ├── hospitalService.ts
│   ├── doctorService.ts
│   └── searchService.ts
├── store/              # State management
│   └── authStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── config/             # Configuration
│   └── api.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Key Components

### Navbar
- Responsive navigation with mobile menu
- Authentication state handling
- Quick access to main sections

### HospitalCard
- Display hospital information
- Accreditation badges
- Rating display
- Quick view details

### DoctorCard
- Doctor profile preview
- Specialization and experience
- Consultation fee
- Book appointment button

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token automatically added to API requests
4. Protected routes check authentication
5. Auto-redirect on token expiry

## 📱 Pages

### Home
- Hero section with search
- Feature highlights
- Popular specialties
- Statistics
- Call-to-action

### Hospitals
- Grid view of hospitals
- Search and filter
- Pagination
- Accreditation filters

### Doctors
- Doctor listings
- Specialization filter
- Experience-based sorting
- Availability status

### Login/Register
- Clean authentication forms
- Form validation
- Error handling
- Remember me option

## 🎯 API Integration

All API calls go through the centralized `api.ts` configuration:

```typescript
// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Styling

Using Tailwind CSS with custom configuration:

- **Primary Color**: Blue (#0ea5e9)
- **Secondary Color**: Purple (#d946ef)
- **Custom Components**: Buttons, cards, inputs
- **Responsive Breakpoints**: sm, md, lg, xl

## 🚀 Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api` |

## 🔧 Development

### Run dev server:
```bash
npm run dev
```

### Build:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Lint:
```bash
npm run lint
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is part of the Medical Tourism Platform.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for better healthcare access worldwide**
