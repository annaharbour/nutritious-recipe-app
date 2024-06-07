import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import Login from '../auth/Login'
import Register from '../auth/Register'

const Landing = (isLoggedIn) => {

  return isLoggedIn ? <Navigate to='/'/> : ( 
    <section className="landing">
    <div className="dark-overlay">
      <div className="landing-inner">
        <h1>Blend</h1>
        <p>
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

export default Landing;