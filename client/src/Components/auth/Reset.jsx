import React, { useState } from 'react';
import { resetPassword } from '../../services/authService';
import { useParams } from 'react-router-dom';

function Reset({ showToast }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      await resetPassword(token, password);
      showToast('Password has been reset successfully', 'success');
    } catch (error) {
      showToast('Failed to reset password. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form className="form" onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default Reset;
