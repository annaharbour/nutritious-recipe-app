import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../../services/authService';

function PasswordResetRequest({ showToast, showForgotten }) {
  const [email, setEmail] = useState('');


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      showToast('Password reset link sent to your email.', 'success');
    } catch (error) {
      showToast('Failed to send reset link. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form className="form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Send Reset Link</button>
      </form>
      <br></br>
      <button className='btn' onClick={()=>showForgotten(false)}>Back</button>
    </div>
  );
}

export default PasswordResetRequest;
