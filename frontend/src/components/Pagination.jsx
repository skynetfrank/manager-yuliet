import React from "react";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // No renderizar paginación si solo hay una página o menos
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Máximo de números de página a mostrar

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-button">
        <LucideChevronLeft size={18} /> Anterior
      </button>
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-button ${currentPage === number ? "active" : ""}`}
        >
          {number}
        </button>
      ))}
      <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-button">
        Siguiente <LucideChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
