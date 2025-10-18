import React, { useState, useEffect, useMemo, useCallback } from 'react'; // <-- Gerekli hook'lar
import { useAuth } from '../contexts/AuthContext';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm'; 

const TodoList = () => {
    const { user } = useAuth();
    
    // Hatanın kaynağı: Bu state tanımlamaları eksik veya silinmiş!
    // Lütfen aşağıdaki satırların olduğundan emin olun:
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Tümü');
    const [editingTodo, setEditingTodo] = useState(null); 
    // --- State Tanımlamaları Bitişi ---

    // fetchTodos'u useCallback ile sarmalıyoruz (önceki düzeltme)
    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Kullanıcıya ait görevleri API'den getir
            const data = await getTodos(user.id);
            // Tarihe göre sıralama (gelecek tarihler üste)
            const sortedData = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            setTodos(sortedData);
        } catch (err) {
            setError(err.message || 'Görevler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [user.id, setTodos, setError, setLoading]); // setState fonksiyonlarını da callback bağımlılığına ekleyerek React'in kurallarını tamamen karşılıyoruz.

    // useEffect kullanımı
    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user, fetchTodos]); 
    
    // ... (Geri kalan handleSaveTodo, handleToggleTodo, handleDeleteTodo, useMemo ve return kısmı aynı kalmalı)

    // Yeni görev ekleme veya mevcut görevi düzenleme işlemi
    const handleSaveTodo = async (text, priority, dueDate) => {
        setLoading(true);
        try {
            if (editingTodo) {
                // Düzenleme (UPDATE/PATCH)
                const updatedTodoData = await updateTodo(editingTodo.id, {
                    text,
                    priority,
                    dueDate
                });
                setTodos((prevTodos) =>
                    prevTodos.map((todo) => (todo.id === updatedTodoData.id ? updatedTodoData : todo))
                );
                setEditingTodo(null); // Düzenleme modundan çık
            } else {
                // Yeni Ekleme (CREATE/POST)
                const newTodo = await addTodo(user.id, text, priority, dueDate);
                setTodos((prevTodos) => [...prevTodos, newTodo].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
            }
        } catch (err) {
            setError(err.message || 'Görev kaydedilirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Görev durumunu değiştirme işlemi (PUT/PATCH)
    const handleToggleTodo = async (id, completed) => {
        try {
            const updatedTodo = await updateTodo(id, { completed });
            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
            );
        } catch (err) {
            setError(err.message || 'Görev güncellenirken hata oluştu.');
        }
    };

    // Görev silme işlemi (DELETE)
    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (err) {
            setError(err.message || 'Görev silinirken hata oluştu.');
        }
    };

    // Filtreleme mantığı
    const filteredTodos = useMemo(() => {
        switch (filter) {
            case 'Aktif':
                return todos.filter((todo) => !todo.completed);
            case 'Tamamlanmış':
                return todos.filter((todo) => todo.completed);
            case 'Tümü':
            default:
                return todos;
        }
    }, [todos, filter]);

    return (
        <div className="todo-app">
            <h1>{user.username} Görev Listesi</h1>
            
            {/* Düzenleme modunda 'Düzenleniyor' başlığı, aksi halde 'Yeni Görev Ekle' */}
            <h3 className="form-title">{editingTodo ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3>
            
            <TodoForm 
                onSaveTodo={handleSaveTodo} 
                loading={loading} 
                editingTodo={editingTodo} // Düzenlenen görevi forma iletiyoruz
                onCancelEdit={() => setEditingTodo(null)} // İptal fonksiyonu
            />

            <div className="filter-buttons">
                {['Tümü', 'Aktif', 'Tamamlanmış'].map((f) => (
                    <button
                        key={f}
                        className={filter === f ? 'active' : ''}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading && <p className="loading-message">Görevler yükleniyor...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && filteredTodos.length === 0 ? (
                <p className="no-tasks">Hiç görev yok. Haydi bir tane ekle!</p>
            ) : (
                <ul className="todo-list">
                    {filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggleTodo}
                            onDelete={handleDeleteTodo}
                            onEdit={() => setEditingTodo(todo)} // Düzenle butonuna tıklandığında
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodoList;