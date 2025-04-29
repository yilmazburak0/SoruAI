'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { Loading } from '@/components/loading';
import { useAuth } from './hooks/use-auth';
import { useExams } from './hooks/use-exams';
import { ExamList } from './page/exam-list';
import { AuthMessage } from './page/auth-message';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated, userStatus, isInitializing, checkTokenExists } = useAuth();
  const { 
    exams, 
    status, 
    error, 
    isNavigating, 
    handleViewExam, 
    handleTakeExam,
    fetchExams 
  } = useExams(isInitializing, isAuthenticated, checkTokenExists);

  // Initial data fetch when authenticated
  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      fetchExams();
    }
  }, [isAuthenticated, isInitializing]);

  // Render content based on state
  const renderContent = () => {
    if (isInitializing || userStatus === 'loading' || 
        (isAuthenticated && status === 'loading') || isNavigating) {
      return (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      );
    }
    
    // Auth message for unauthenticated users
    if (!isAuthenticated) {
      return <AuthMessage />;
    }
    
    // Error message when exam loading fails
    if (status === 'failed') {
      return (
        <div className={styles.card}>
          <div className={styles.errorMessageContainer}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorMessage}>Hata: {error}</p>
          </div>
        </div>
      );
    }
    
    // Exam list when data is successfully loaded
    if (status === 'succeeded') {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.contentCard}
        >
          <div className={styles.sectionHeader}>
            <FaChalkboardTeacher className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Mevcut Sınavlar</h2>
          </div>
          <ExamList 
            exams={exams} 
            onViewExam={handleViewExam} 
            onTakeExam={handleTakeExam} 
          />
        </motion.div>
      );
    }
    
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        {renderContent()}
      </div>
    </div>
  );
}