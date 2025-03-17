import React from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Footer from './Footer';
import { ServiceProvider } from './ServiceContext';
import { useOptimisticAddTodoMutation } from '../services';

const App: React.FC = () => {
  const { todos, addTodoOptimistic, loading } = useOptimisticAddTodoMutation();

  return (
    <div className="todo-app">
      <h1>Todo App with IoC Container</h1>
      <p className="subtitle">Using TypeScript IoC for dependency injection</p>
      <AddTodo addTodoOptimistic={addTodoOptimistic} isLoading={loading} />
      <TodoList todos={todos} />
      <Footer />
    </div>
  );
};

const AppContainer = () => {
  return (
    <ServiceProvider>
      <App />
    </ServiceProvider>
  );
};

export default AppContainer;
