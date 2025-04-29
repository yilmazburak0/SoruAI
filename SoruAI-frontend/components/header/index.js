'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken, logout } from "@/stores/user-store/index.jsx";

import styles from "./styles.module.css";

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); 
  const { isAuthenticated, user, status } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verify token on component mount and route change
    dispatch(verifyToken());
  }, [dispatch, pathname]); // pathname değiştiğinde de token kontrolü yap

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} container fluid`}>
      <div className={styles.headerWrapper}>
        <Link className={styles.logo} href="/">
          SoruAI
        </Link>
        
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <div className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <nav className={`${styles.navigationMenu} ${isMobileMenuOpen ? styles.menuOpen : ''}`}>
          {isAuthenticated && user ? (
            <>
              <span className={styles.welcomeText}>Hoşgeldin, {user.userName}</span>
              <button className={styles.navButton} onClick={handleLogout}>
                Çıkıs yap
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                Giriş yap
              </Link>
              <Link href="/register" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                Kayıt ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export { Header };