'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import styles from './styles.module.css';

import { loginSuccess } from '@/stores/user-store/index.jsx';
import { validateLoginForm } from '@/services/validation/loginSchema';
import { login } from '@/services/api/authService';
import { setAuthCookie } from '@/utils/auth';
import LoginForm from '@/components/login/LoginForm';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData, setErrors, setBackendError) => {
    // Validate form
    const { isValid, errors } = await validateLoginForm(formData);
    
    if (!isValid) {
      setErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Make API call
      const data = await login(formData);
      
      // Set auth cookie
      setAuthCookie(data.token);
      
      // Update Redux store
      dispatch(loginSuccess({
        user: data.user,
        valid: true
      }));
      
      // Redirect to home page after short delay
      setTimeout(() => {
        router.push('/');
      }, 100);
      
    } catch (err) {
      setBackendError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <LoginForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}