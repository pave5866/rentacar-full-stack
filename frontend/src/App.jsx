import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarDetails from './pages/CarDetails';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminReservations from './pages/admin/AdminReservations';
import AdminSettings from './pages/admin/AdminSettings';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store';
import { updateSiteSettings } from './constants/siteConstants';
import { SITE_CONSTANTS } from './constants/siteConstants';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        if (response.data) {
          updateSiteSettings(response.data);
        }
      } catch (error) {
        // Hata durumunda sessizce devam et
      }
    };

    loadSettings();

    // Favicon'u güncelle
    const updateFavicon = () => {
      const favicon = document.querySelector('link[rel="icon"]');
      const newHref = SITE_CONSTANTS.SITE_LOGO ? 
        `http://localhost:5000${SITE_CONSTANTS.SITE_LOGO}` : 
        '/default-favicon.svg';
      
      if (!favicon) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = SITE_CONSTANTS.SITE_LOGO ? 'image/x-icon' : 'image/svg+xml';
        link.href = newHref;
        document.head.appendChild(link);
      } else {
        favicon.type = SITE_CONSTANTS.SITE_LOGO ? 'image/x-icon' : 'image/svg+xml';
        favicon.href = newHref;
      }
      
      // Sekme başlığını güncelle
      document.title = SITE_CONSTANTS.SITE_NAME;
    };

    updateFavicon();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/cars"
                  element={
                    <AdminRoute>
                      <AdminCars />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reservations"
                  element={
                    <AdminRoute>
                      <AdminReservations />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
