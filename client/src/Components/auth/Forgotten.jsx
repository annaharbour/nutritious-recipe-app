import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../../services/authService';

function PasswordResetRequest({ showToast, showForgotten }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      showToast('Password reset link sent to your email - may take up to 5 minutes to arrive.', 'success');
    } catch (error) {
      showToast('Failed to send reset link. Please try again.', 'error');
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
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
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">Send Reset Link</button>
      </form>
      <br></br>
      <button className='btn' onClick={()=>showForgotten(false)}>Back</button>
    </div>
  );
}

export default PasswordResetRequest;
