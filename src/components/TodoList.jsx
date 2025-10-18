import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm'; // Formu yeniden kullanıyoruz

const TodoList = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Tümü');
    const [editingTodo, setEditingTodo] = useState(null); // Düzenlenen görevi tutar

    // API'den görevleri çekme işlemi
    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTodos(user.id);
            // Tarihe göre sıralama (gelecek tarihler üste)
            const sortedData = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            setTodos(sortedData);
        } catch (err) {
            setError(err.message || 'Görevler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

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