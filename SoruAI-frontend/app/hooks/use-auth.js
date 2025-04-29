'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '@/stores/user-store/index.jsx';
import { useTokenCookie } from './use-cookies';

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, status: userStatus } = useSelector((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);
  const { checkTokenExists } = useTokenCookie();

  useEffect(() => {
    // First load token check
    const hasToken = checkTokenExists();
    
    if (hasToken) {
      // If token exists, verify user
      dispatch(verifyToken())
        .finally(() => setIsInitializing(false));
    } else {
      // No token, complete initialization
      setIsInitializing(false);
    }
  }, [dispatch]);

  return { 
    isAuthenticated, 
    userStatus, 
    isInitializing,
    checkTokenExists,
  };
}