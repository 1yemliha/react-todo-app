import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserCookie, setUserCookie, removeUserCookie } from '../utils/helpers';
import { login as apiLogin, register as apiRegister } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Başlangıçta cookie'den kullanıcı bilgisini al
    const [user, setUser] = useState(getUserCookie());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Kullanıcı state'i değiştiğinde cookie'yi güncelle
    useEffect(() => {
        if (user) {
            setUserCookie(user);
        } else {
            removeUserCookie();
        }
    }, [user]);

    // src/contexts/AuthContext.js

// ... (diğer importlar, useAuth, AuthProvider ve state tanımlamaları aynı kalmalı)

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await apiLogin(username, password);
            setUser(userData);
            return true;
        } catch (err) {
            let displayError = 'Giriş başarısız oldu. Lütfen tekrar deneyin.';
            
            // API'den gelen spesifik hata mesajına göre kullanıcı dostu metin belirle
            if (err.message === "USER_NOT_FOUND") {
                displayError = "Bu kullanıcı adına ait hesap bulunamadı. Lütfen önce Kayıt Olun.";
            } else if (err.message === "WRONG_PASSWORD") {
                displayError = "Hatalı şifre girdiniz.";
            }
            
            setError(displayError);
            return false;
        } finally {
            setLoading(false);
        }
    };

// ... (register ve logout fonksiyonları aynı kalmalı)
    const register = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await apiRegister(username, password);
            setUser(userData);
            return true;
        } catch (err) {
            setError(err.message || 'Kayıt başarısız.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        // removeUserCookie zaten useEffect içinde çağrılacaktır, ancak manuel olarak da çağırabiliriz.
        removeUserCookie();
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};