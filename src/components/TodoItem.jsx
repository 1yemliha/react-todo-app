import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
    // Öncelik seviyesine göre renk sınıfı belirleme
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'Yüksek':
                return 'priority-high';
            case 'Orta':
                return 'priority-medium';
            case 'Düşük':
                return 'priority-low';
            default:
                return '';
        }
    };

    // Bitiş tarihi kontrolü
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = todo.dueDate && !todo.completed && todo.dueDate < today; // Bitiş tarihi geçti mi?

    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''} ${getPriorityClass(todo.priority)}`}>
            <div className="todo-content">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id, !todo.completed)}
                />
                <span className="todo-text">{todo.text}</span>
            </div>
            <div className="todo-meta">
                <span className="priority-tag">{todo.priority}</span>
                {todo.dueDate && (
                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                        {new Date(todo.dueDate).toLocaleDateString('tr-TR')}
                    </span>
                )}
                
                {/* YENİ: Düzenle Butonu */}
                <button onClick={() => onEdit(todo.id)} className="edit-button">
                    Düzenle
                </button>
                
                <button onClick={() => onDelete(todo.id)} className="delete-button">
                    Sil
                </button>
            </div>
        </li>
    );
};

export default TodoItem;