# CORS Configuration Fix

## Problem
Frontend (localhost:5173) cannot communicate with backend (localhost:8080) due to CORS restrictions.

## Solution Applied

### 1. Backend CORS Configuration ✅

**File Created**: `medicalTourism/src/main/java/com/medicalTourism/config/CorsConfig.java`

- Allows origins: localhost:5173, localhost:3000, localhost:4173
- Allows all HTTP methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allows all headers
- Allows credentials (cookies, auth headers)
- Exposes Authorization and Content-Type headers
- Sets preflight cache to 1 hour

**File Updated**: `medicalTourism/src/main/java/com/medicalTourism/config/SecurityConfig.java`

- Added CORS configuration to security filter chain
- CORS is now applied before CSRF and other security filters

### 2. Frontend API Endpoints Fixed ✅

**Files Updated**:
- `src/services/authService.ts` - Added `/v1/` prefix
- `src/services/hospitalService.ts` - Added `/v1/` prefix

**Remaining Services to Update** (Need `/v1/` prefix):
- doctorService.ts
- treatmentService.ts
- searchService.ts
- patientService.ts
- medicalReportService.ts
- inquiryService.ts
- assessmentService.ts
- costEstimateService.ts
- bookingService.ts
- paymentService.ts
- reviewService.ts
- notificationService.ts

## How to Apply Fix

### Backend:
1. The CORS configuration files are already created
2. Restart the Spring Boot application:
   ```bash
   cd medicalTourism
   mvn spring-boot:run
   ```

### Frontend:
1. Update all remaining service files to use `/v1/` prefix
2. Restart the Vite dev server:
   ```bash
   cd medicalTourism-front
   npm run dev
   ```

## Testing
1. Open browser to http://localhost:5173
2. Try to login - should work without CORS errors
3. Check browser console - no CORS errors
4. Check Network tab - OPTIONS requests should return 200 OK

## Expected Behavior
- ✅ OPTIONS preflight requests return 200 OK
- ✅ POST/GET/PUT/DELETE requests work
- ✅ Authorization headers are sent and received
- ✅ No CORS errors in console

## Notes
- The backend now accepts requests from multiple frontend ports (5173, 3000, 4173)
- All API endpoints must use `/api/v1/` prefix
- JWT tokens are properly handled with CORS
