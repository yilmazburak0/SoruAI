'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loading } from '@/components/loading';
import styles from './styles.module.css';

export default function RegisterForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    
    try {
      await onSubmit(formData, setErrors, setBackendError);
    } catch (error) {
      setBackendError(error.message);
    }
  };
  
  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Kayıt Ol</h1>
      
      {backendError && <div className={styles.error}>{backendError}</div>}
      
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="userName">Kullanıcı Adı</label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className={errors.userName ? styles.inputError : ''}
          />
          {errors.userName && <span className={styles.errorText}>{errors.userName}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="firstName">Ad</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? styles.inputError : ''}
          />
          {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Soyad</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? styles.inputError : ''}
          />
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? <Loading/> : 'Kayıt Ol'}
        </button>
      </form>
      
      <div className={styles.links}>
        Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
      </div>
    </div>
  );
}