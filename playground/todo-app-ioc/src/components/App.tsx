import React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Footer from './Footer';
import { ServiceProvider } from './ServiceContext';

const App: React.FC = () => {
  return (
    <ServiceProvider>
      <div className="todo-app">
        <h1>Todo App with IoC Container</h1>
        <p className="subtitle">Using TypeScript IoC for dependency injection</p>
        <AddTodo />
        <TodoList />
        <Footer />
      </div>
    </ServiceProvider>
  );
};

export default App;
