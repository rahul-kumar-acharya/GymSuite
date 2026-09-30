import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

export const PasswordReset = () => {
  const { uid, token } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isConfirm = Boolean(uid && token);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      if (isConfirm) {
        await api.post('/auth/password-reset/confirm/', { uid: Number(uid), token, new_password: password });
        setMessage('Password reset successfully. You can sign in now.');
      } else {
        await api.post('/auth/password-reset/', { email });
        setMessage('If the email exists, a reset link has been sent.');
      }
    } catch (err) {
      setError(err.response?.data?.token?.[0] || 'The request could not be completed.');
    }
  };

  return <div className="flex min-h-screen items-center justify-center bg-cream-100 p-4"><form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-sand bg-white p-8 shadow-lg"><div><h1 className="font-heading text-2xl font-bold text-espresso-800">{isConfirm ? 'Choose a new password' : 'Reset your password'}</h1><p className="mt-1 text-xs text-mutedGray">{isConfirm ? 'Use at least eight characters.' : 'We will send a secure reset link if the account exists.'}</p></div>{!isConfirm ? <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-xl border border-sand px-4 py-3 text-sm" /> : <input required minLength="8" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-xl border border-sand px-4 py-3 text-sm" />}{error && <p className="rounded-xl bg-statusRed-bg p-3 text-xs font-semibold text-statusRed-text">{error}</p>}{message && <p className="rounded-xl bg-statusGreen-bg p-3 text-xs font-semibold text-statusGreen-text">{message}</p>}<button className="w-full rounded-xl bg-espresso-800 py-3 text-sm font-bold text-cream-100">{isConfirm ? 'Set new password' : 'Send reset link'}</button><Link to="/login" className="block text-center text-xs font-bold text-brass-600">Back to login</Link></form></div>;
};
