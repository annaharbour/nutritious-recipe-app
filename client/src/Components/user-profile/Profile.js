import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import { getProfileById } from '../../actions/profile';
import axios from 'axios';

const Profile = ({ getProfileById, auth }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  useEffect( () => {
   axios.get(`/profile/user/${id}`).then((res) => {
    setProfile(res.data.profile)
  });
  }, [getProfileById, id]);
  if(!profile) {
    return null
  } else {
    console.log(profile)
  }

  return (
    <section className="container">
      {profile === null ? (
        <div>Loading...</div>
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Smoothies</h2>
            </div>
          </div>
        </Fragment>
      )}
    </section>
  );
};


Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);