import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Login from '../Auth/Login'
import Register from '../Auth/Register'

const Landing = ({isAuthenticated}) => {
  if(isAuthenticated){
    return <Navigate to='/Dashboard'/>
  }

  return (
    <section className="landing">
    <div className="dark-overlay">
      <div className="landing-inner">
        <h1 className="x-large">Blend</h1>
        <p className="lead">
          Time to up your smoothie game
        </p>
        <div className="buttons">
          <Link to="/register" element={<Register/>} className="btn btn-primLinkry">Sign Up</Link>
          <Link to="/login" element={<Login/>} className="btn btn-light">Login</Link>
        </div>
      </div>
    </div>
  </section>
  )
}


Landing.propTypes = {
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps)(Landing)