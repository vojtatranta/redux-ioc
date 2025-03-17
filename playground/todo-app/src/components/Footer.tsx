import React from 'react';
import FilterLink from './FilterLink';
import { VisibilityFilter } from '../types';

const Footer: React.FC = () => {
  return (
    <div className="filters">
      <span>Show: </span>
      <FilterLink filter={VisibilityFilter.SHOW_ALL}>All</FilterLink>
      <FilterLink filter={VisibilityFilter.SHOW_ACTIVE}>Active</FilterLink>
      <FilterLink filter={VisibilityFilter.SHOW_COMPLETED}>Completed</FilterLink>
    </div>
  );
};

export default Footer;
