import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = () => {
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle'/> Edit Profile
      </Link>
      <Link to='/create-recipe' className='btn btn-light'>
        <i className='fas fa-user-circle'/> Create Recipe
      </Link>
    </div>
  );
};

export default DashboardActions;