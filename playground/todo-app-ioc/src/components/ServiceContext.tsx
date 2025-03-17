import React, { createContext, useContext, useState, useEffect } from 'react';
import { ManagerInterface, Services, services, manager } from '../services';
import { Provider } from 'react-redux';

const ServiceContext = createContext<Services | null>(null);
const ManagerContext = createContext<ManagerInterface | null>(null);

// Create a provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={services.store}>
      <ServiceContext.Provider value={services}>
        <ManagerContext.Provider value={manager}>{children}</ManagerContext.Provider>
      </ServiceContext.Provider>
    </Provider>
  );
};

// Custom hooks to use the services
export const useManager = () => {
  const manager = useContext(ManagerContext);
  if (!manager) {
    throw new Error('useManager must be used within a ServiceProvider');
  }
  return manager;
};
