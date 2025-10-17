import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hospitals from './pages/Hospitals';
import HospitalDetail from './pages/HospitalDetail';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Treatments from './pages/Treatments';
import Search from './pages/Search';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Profile from './pages/dashboard/Profile';
import MedicalReports from './pages/dashboard/MedicalReports';
import SubmitInquiry from './pages/dashboard/SubmitInquiry';
import MyInquiries from './pages/dashboard/MyInquiries';
import InquiryDetail from './pages/dashboard/InquiryDetail';
import ViewAssessment from './pages/dashboard/ViewAssessment';
import CostEstimate from './pages/dashboard/CostEstimate';
import CreateBooking from './pages/dashboard/CreateBooking';
import MyBookings from './pages/dashboard/MyBookings';
import BookingDetail from './pages/dashboard/BookingDetail';
import PaymentPage from './pages/dashboard/PaymentPage';
import SubmitReview from './pages/dashboard/SubmitReview';
import Notifications from './pages/dashboard/Notifications';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:id" element={<HospitalDetail />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/search" element={<Search />} />

            {/* Patient Dashboard */}
            <Route path="/dashboard" element={<PatientDashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports" element={<MedicalReports />} />
              <Route path="inquiries" element={<MyInquiries />} />
              <Route path="inquiries/new" element={<SubmitInquiry />} />
              <Route path="inquiries/:id" element={<InquiryDetail />} />
              <Route path="inquiries/:id/assessment" element={<ViewAssessment />} />
              <Route path="inquiries/:id/cost-estimate" element={<CostEstimate />} />
              <Route path="inquiries/:id/booking/new" element={<CreateBooking />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="bookings/:id" element={<BookingDetail />} />
              <Route path="payments/:id" element={<PaymentPage />} />
              <Route path="reviews/new" element={<SubmitReview />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
