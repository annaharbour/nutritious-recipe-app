import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({
  profile: {
    user: { name },
  },
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <h1 className="large">{name}</h1>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;