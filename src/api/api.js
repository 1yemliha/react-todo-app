import axios from 'axios';

// json-server'ın çalıştığı adres
const API_URL = 'https://react-todo-app-delta-flax.vercel.app/';

// Hata yönetimi için genel bir fonksiyon
const handleError = (error, operation) => {
    console.error(`API Hatası (${operation}):`, error.response?.data || error.message);
    return Promise.reject(error.response?.data || `İşlem sırasında bir hata oluştu: ${operation}`);
};

// src/api/api.js

// ... (diğer importlar ve handleError fonksiyonu aynı kalmalı)

// Yetkilendirme (Authentication) İşlemleri
export const login = async (username, password) => {
    try {
        // Kullanıcıyı kullanıcı adına göre bul
        const response = await axios.get(`${API_URL}/users?username=${username}`);
        const user = response.data[0];

        if (!user) {
            // Kullanıcı bulunamadıysa (Yeni hata türü)
            throw new Error("USER_NOT_FOUND"); 
        }

        if (user.password === password) {
            // Şifre doğru, kullanıcıyı döndür
            return {
                id: user.id,
                username: user.username
            };
        } else {
            // Kullanıcı bulundu ama şifre yanlış (Yeni hata türü)
            throw new Error("WRONG_PASSWORD");
        }
    } catch (error) {
        // Axios veya diğer hataları yakala
        if (error.message === "USER_NOT_FOUND" || error.message === "WRONG_PASSWORD") {
            // Spesifik hataları direkt AuthContext'e ilet
            throw error;
        }
        return handleError(error, 'Giriş (Login)');
    }
};
// ... (register, getTodos ve diğer fonksiyonlar aynı kalmalı)

export const register = async (username, password) => {
    try {
        // Kullanıcı adının zaten kullanılıp kullanılmadığını kontrol et
        const existingUser = await axios.get(`${API_URL}/users?username=${username}`);
        if (existingUser.data.length > 0) {
            throw new Error("Bu kullanıcı adı zaten alınmış.");
        }

        // Yeni kullanıcıyı kaydet
        const response = await axios.post(`${API_URL}/users`, { username, password });
        return {
            id: response.data.id,
            username: response.data.username
        };
    } catch (error) {
        return handleError(error, 'Kayıt (Register)');
    }
};


// Todo İşlemleri (CRUD)

// READ (Okuma) - Kullanıcının tüm todolarını getir
export const getTodos = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/todos?userId=${userId}`);
        return response.data;
    } catch (error) {
        return handleError(error, 'Görevleri Getir');
    }
};

// CREATE (Oluşturma)
export const addTodo = async (userId, text, priority, dueDate) => {
    try {
        const newTodo = {
            userId, // Hangi kullanıcıya ait olduğu bilgisi
            text,
            completed: false,
            priority: priority || 'Orta',
            dueDate: dueDate || null
        };
        const response = await axios.post(`${API_URL}/todos`, newTodo);
        return response.data;
    } catch (error) {
        return handleError(error, 'Görev Ekle');
    }
};

// UPDATE (Güncelleme)
export const updateTodo = async (id, updatedFields) => {
    try {
        // json-server için PUT veya PATCH kullanılabilir. Burada PATCH kullanıyoruz.
        const response = await axios.patch(`${API_URL}/todos/${id}`, updatedFields);
        return response.data;
    } catch (error) {
        return handleError(error, 'Görev Güncelle');
    }
};

// DELETE (Silme)
export const deleteTodo = async (id) => {
    try {
        await axios.delete(`${API_URL}/todos/${id}`);
        return id; // Silinen id'yi döndür
    } catch (error) {
        return handleError(error, 'Görev Sil');
    }
};