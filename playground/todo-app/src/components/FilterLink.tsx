import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import { VisibilityFilter } from '../types';
import { RootState } from '../reducers';
import { AppDispatch } from '../store';

interface FilterLinkProps {
  filter: VisibilityFilter;
  children: React.ReactNode;
}

const FilterLink: React.FC<FilterLinkProps> = ({ filter, children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFilter = useSelector((state: RootState) => state.visibilityFilter);

  const handleClick = () => {
    dispatch(setVisibilityFilter(filter));
  };

  return (
    <button
      onClick={handleClick}
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
