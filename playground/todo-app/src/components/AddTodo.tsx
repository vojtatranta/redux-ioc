import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo, addTodoAsync } from '../actions';
import { AppDispatch } from '../store';

const AddTodo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addTodo(text));
    setText('');
  };

  const handleAsyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    await dispatch(addTodoAsync(text));
    setText('');

    // Reset loading state after the async action completes
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
