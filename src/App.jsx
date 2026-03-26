import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import UserLoginPage from './pages/UserLoginPage';
import EntryChoicePage from './pages/EntryChoicePage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductManagement from './pages/ProductManagement';
import BillUploadPage from './pages/BillUploadPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import OrdersPage from './pages/OrdersPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import ReturnExchangePage from './pages/ReturnExchangePage';
import ChatbotPage from './pages/ChatbotPage';
import WhatsAppSettingsPage from './pages/WhatsAppSettingsPage';
import AdminLoginPage from './pages/AdminLoginPage';

// Robust Error Boundary
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF6E9] flex flex-col items-center justify-center p-8 text-center font-serif">
          <h1 className="text-4xl text-[#800000] mb-4">A Sacred Error Occurred</h1>
          <p className="text-[#5D4037]/60 mb-8 max-w-md italic">"{this.state.error?.message || 'The threads of our digital weave have tangled.'}"</p>
          <button onClick={() => window.location.href = '/'} className="bg-[#800000] text-white px-8 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold">Restart Journey</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Separate component for the dashboard switch to avoid complex render props in Routes
function DashboardRouter() {
  const { userRole, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-[#FBF6E9] flex flex-col items-center justify-center font-serif italic text-[#800000]">
      Consulting the sanctity...
    </div>
  );

  return userRole === 'admin' ? <DashboardPage /> : <UserDashboardPage />;
}

function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<EntryChoicePage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/user/login" element={<UserLoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardRouter /></ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute><CartPage /></ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute><ProductDetailsPage /></ProtectedRoute>
              } />
              
              {/* Other Common Routes */}
              <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/bulk-orders" element={<ProtectedRoute><BulkOrdersPage /></ProtectedRoute>} />
              <Route path="/returns" element={<ProtectedRoute><ReturnExchangePage /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

              {/* Admin-Only Routes */}
              <Route path="/bills" element={<ProtectedRoute requiredRole="admin"><BillUploadPage /></ProtectedRoute>} />
              <Route path="/price-comparison" element={<ProtectedRoute requiredRole="admin"><PriceComparisonPage /></ProtectedRoute>} />
              <Route path="/whatsapp-settings" element={<ProtectedRoute requiredRole="admin"><WhatsAppSettingsPage /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;
