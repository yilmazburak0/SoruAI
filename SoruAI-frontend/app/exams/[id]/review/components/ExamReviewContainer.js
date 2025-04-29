import { Loading } from '@/components/loading';
import styles from '../styles.module.css';
import { ErrorDisplay } from './ErrorDisplay';
import { ExamSummary } from './ExamSummary';
import { QuestionsList } from './QuestionsList';
import { Pagination } from './Pagination';

export function ExamReviewContainer({
  examDetails,
  loading,
  error,
  expandedSolutions,
  currentPage,
  totalPages,
  indexOfFirstQuestion,
  indexOfLastQuestion,
  currentQuestions,
  stats,
  toggleSolution,
  paginate,
  goToHome
}) {
  if (loading) {
    return (
      <div className={styles.container}>
        <Loading/>
      </div>
    );
  }
  
  if (error || !examDetails) {
    return (
      <ErrorDisplay
        error={error}
        onGoHome={goToHome}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Sınav İnceleme: {examDetails.title}</h1>
      
      <ExamSummary stats={stats} />
      
      <div className={styles.questionsList}>
        <div className={styles.paginationHeader}>
          <h2 className={styles.sectionTitle}>
            Sorular {indexOfFirstQuestion + 1} - {Math.min(indexOfLastQuestion, stats.totalQuestions)}
          </h2>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
        
        <QuestionsList
          questions={currentQuestions}
          indexOfFirstQuestion={indexOfFirstQuestion}
          expandedSolutions={expandedSolutions}
          toggleSolution={toggleSolution}
        />
        
        {/* Bottom pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
      
      <button 
        className={styles.buttonPrimary}
        onClick={goToHome}
      >
        Ana sayfaya dön
      </button>
    </div>
  );
}