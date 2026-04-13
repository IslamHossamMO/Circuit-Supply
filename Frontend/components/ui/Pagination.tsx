"use client";

import { Button } from "./Button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const clientParams = useSearchParams();

  const getMergedParams = (newPage: number) => {
    const params = new URLSearchParams(clientParams.toString());
    params.set("page", String(newPage));
    return params.toString();
  };

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => router.push(`/product?${getMergedParams(Math.max(1, page - 1))}`)}
      >
        Previous
      </Button>
      <span>Page {page} of {totalPages}</span>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => router.push(`/product?${getMergedParams(Math.min(totalPages, page + 1))}`)}
      >
        Next
      </Button>
    </div>
  );
}
