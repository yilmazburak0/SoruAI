import styles from '../styles.module.css';

export function Pagination({ currentPage, totalPages, paginate }) {
  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        önceki
      </button>
      
      <div className={styles.pageNumbers}>
        {[...Array(totalPages).keys()].map(number => (
          <button
            key={number + 1}
            className={`${styles.pageNumber} ${currentPage === number + 1 ? styles.activePage : ''}`}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>
      
      <button
        className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        sonraki
      </button>
    </div>
  );
}