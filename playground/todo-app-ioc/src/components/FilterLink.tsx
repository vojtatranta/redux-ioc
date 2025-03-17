import React from 'react';
import { TodoState, VisibilityFilter } from '../types';
import { useManager } from './ServiceContext';
import { useSelector } from 'react-redux';

interface FilterLinkProps {
  filter: VisibilityFilter;
  children: React.ReactNode;
}

const FilterLink: React.FC<FilterLinkProps> = ({ filter, children }) => {
  const manager = useManager();

  const currentFilter = useSelector((state: TodoState) => state.visibilityFilter);

  return (
    <button
      onClick={() => manager.setVisibilityFilter(filter)}
      disabled={filter === currentFilter}
      style={{
        marginLeft: '4px',
        marginRight: '4px',
        fontWeight: filter === currentFilter ? 'bold' : 'normal',
      }}
    >
      {children}
    </button>
  );
};

export default FilterLink;
