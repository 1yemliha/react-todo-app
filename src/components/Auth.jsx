import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Giriş/Kayıt modu
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); // Şifre alanı eklendi [cite: 8]
    const { login, register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;

        if (isLogin) {
            // Giriş işlemi (API isteği) [cite: 9]
            success = await login(username, password);
        } else {
            // Kayıt işlemi (API isteği) [cite: 9]
            success = await register(username, password);
        }

        if (success) {
            navigate('/'); // Başarılıysa todo listesine yönlendir
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                
                <input
                    type="password" // Yorumu BURADAN SİLİN
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
            </form>
            <button
                className="toggle-button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
            >
                {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
            </button>
        </div>
    );
};

export default Auth;