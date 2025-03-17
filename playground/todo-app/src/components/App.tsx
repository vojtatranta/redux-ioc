import React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <div className="todo-app">
      <h1>Todo App with Redux</h1>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
  );
};

export default App;
