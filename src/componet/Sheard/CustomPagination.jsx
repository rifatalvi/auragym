import React from "react";
import { Pagination } from "@heroui/react";

export default function CustomPagination({ page, totalPages, onChange, total }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (i === left - 1 || i === right + 1) {
        pages.push("...");
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
            <Pagination.PreviousIcon />
            <span>Prev</span>
          </Pagination.Previous>
        </Pagination.Item>

        {pages.map((p, idx) => (
          <Pagination.Item key={`page-${p}-${idx}`}>
            {p === "..." ? (
              <Pagination.Ellipsis />
            ) : (
              <Pagination.Link isActive={p === page} onClick={() => onChange(p)}>
                {p}
              </Pagination.Link>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
