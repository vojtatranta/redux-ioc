import React, { useState } from 'react';
import { useManager } from './ServiceContext';
import { Todo } from '../types';

const AddTodo: React.FC<{
  addTodoOptimistic: (todo: Pick<Todo, 'text' | 'completed'>) => Promise<void>;
  isLoading?: boolean;
}> = ({ addTodoOptimistic, isLoading }) => {
  const [text, setText] = useState('');
  const manager = useManager();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    manager.addTodo(text);
    setText('');
  };

  const handleAsyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setText('');
    await addTodoOptimistic({ text, completed: false });
  };

  return (
    <div className="add-todo">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new todo..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Add Todo
        </button>
        <button type="button" onClick={handleAsyncSubmit} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Async'}
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
