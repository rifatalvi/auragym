"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@heroui/react";

export default function CustomPagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => page > 1 && onChange(page - 1)}
            aria-disabled={page === 1}
            style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
          />
        </PaginationItem>

        {getPages().map((p, idx) => (
          <PaginationItem key={`${p}-${idx}`}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={p === page}
                onClick={() => onChange(p)}
                style={{ cursor: "pointer" }}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => page < totalPages && onChange(page + 1)}
            aria-disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
