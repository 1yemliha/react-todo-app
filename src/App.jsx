import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TodoList from './components/TodoList';
import Auth from './components/Auth';
import './App.css'; // Stil dosyası (CSS) importu

// Giriş yapılıp yapılmadığını kontrol eden özel rota bileşeni
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Auth kontrolü sırasında yüklenme durumu
        return <div className="loading-full-screen">Kontrol ediliyor...</div>;
    }

    // Giriş yapılmadıysa Auth sayfasına yönlendir 
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AppContent = () => {
    const { logout } = useAuth();
    const { isAuthenticated } = useAuth();

    return (
        <div className="app-container">
            {/* Navigasyon ve Çıkış Butonu */}
            <header className="app-header">
                <nav>
                    {isAuthenticated && (
                        <button onClick={logout} className="logout-button">
                            Çıkış Yap
                        </button>
                    )}
                </nav>
            </header>
            
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <TodoList />
                        </ProtectedRoute>
                    }
                />
                {/* Tanımlanmayan rotaları ana sayfaya yönlendir */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;