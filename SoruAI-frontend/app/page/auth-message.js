'use client';

import Link from 'next/link';
import styles from '../styles.module.css';
import { FaSignInAlt, FaUserPlus, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function AuthMessage() {
  return (
    <motion.div 
      className={styles.authMessage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.authIcon}>
        <FaBookOpen size={50} color="#3498db" />
      </div>
      
      <h2>Sınavları görmek için giriş yapmalısınız</h2>
      <p>Sınavlara katılmak ve ilerlemenizi takip etmek için lütfen giriş yapın veya yeni bir hesap oluşturun.</p>
      
      <div className={styles.authButtons}>
        <Link href="/login" className={`${styles.button} ${styles.primaryButton}`}>
          <FaSignInAlt /> Giriş Yap
        </Link>
        <Link href="/register" className={`${styles.button} ${styles.secondaryButton}`}>
          <FaUserPlus /> Kayıt Ol
        </Link>
      </div>
    </motion.div>
  );
}