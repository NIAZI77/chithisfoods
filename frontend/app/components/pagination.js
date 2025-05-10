"use client";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxPageNumbersToShow = 5;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <nav className="flex justify-center mt-6 px-2 md:scale-100 scale-75">
      <ul className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-full sm:w-auto">
        <li
          className={`mx-1 ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white font-bold"
          >
            <FaAngleLeft />
          </button>
        </li>

        {startPage > 1 && (
          <li className="mx-1">
            <button
              onClick={() => goToPage(1)}
              className={`px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white font-bold ${
                currentPage === 1 ? "bg-rose-500 text-white" : ""
              }`}
            >
              1
            </button>
          </li>
        )}

        {startPage > 2 && <li className="mx-2 text-gray-500">...</li>}

        {pageNumbers.map((page) => (
          <li key={page} className="mx-1">
            <button
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white font-bold ${
                currentPage === page ? "bg-rose-500 text-white" : ""
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        {endPage < totalPages - 1 && (
          <li className="mx-2 text-gray-500">...</li>
        )}

        {endPage < totalPages && (
          <li className="mx-1">
            <button
              onClick={() => goToPage(totalPages)}
              className={`px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white font-bold ${
                currentPage === totalPages ? "bg-rose-500 text-white" : ""
              }`}
            >
              {totalPages}
            </button>
          </li>
        )}

        <li
          className={`mx-1 ${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white font-bold"
          >
            <FaAngleRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
