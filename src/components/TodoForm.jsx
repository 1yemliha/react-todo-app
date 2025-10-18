import React, { useState, useEffect } from 'react';

// onSaveTodo: Ekleme veya Düzenleme için tek bir fonksiyon
const TodoForm = ({ onSaveTodo, loading, editingTodo, onCancelEdit }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('Orta');
    const [dueDate, setDueDate] = useState('');

    // editingTodo değiştiğinde formu ilgili görevin verileriyle doldur
    useEffect(() => {
        if (editingTodo) {
            setText(editingTodo.text);
            setPriority(editingTodo.priority || 'Orta');
            // dueDate null olabilir, bu yüzden boş string olarak ayarlıyoruz
            setDueDate(editingTodo.dueDate || ''); 
        } else {
            // Düzenleme bitince formu sıfırla
            setText('');
            setPriority('Orta');
            setDueDate('');
        }
    }, [editingTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        onSaveTodo(text, priority, dueDate);

        // Formu sıfırlama işlemi (onSaveTodo'da başarılı olursa zaten form sıfırlanacaktır,
        // ancak bu, formu hemen temizlemek için de kullanılabilir)
        if (!editingTodo) {
            setText('');
            setPriority('Orta');
            setDueDate('');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder={editingTodo ? "Görevi düzenle..." : "Yeni görev ekle..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                disabled={loading}
            />
            <div className="form-controls">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={loading}
                >
                    <option value="Düşük">Düşük Öncelik</option>
                    <option value="Orta">Orta Öncelik</option>
                    <option value="Yüksek">Yüksek Öncelik</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={loading}
                    title="Bitiş Tarihi"
                />
                <button type="submit" disabled={loading} className={editingTodo ? 'save-button' : 'add-button'}>
                    {loading ? 'Kaydediliyor...' : editingTodo ? 'Kaydet' : 'Ekle'}
                </button>
                
                {/* Düzenleme modunda İptal butonu göster */}
                {editingTodo && (
                    <button type="button" onClick={onCancelEdit} className="cancel-button" disabled={loading}>
                        İptal
                    </button>
                )}
            </div>
        </form>
    );
};

export default TodoForm;