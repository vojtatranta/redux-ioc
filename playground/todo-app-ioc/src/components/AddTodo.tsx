import React, { useState } from 'react';
import { useManager } from './ServiceContext';

const AddTodo: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    await manager.addTodoAsync(text);
    setText('');
    setIsLoading(false);
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
