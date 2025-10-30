"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSortPaginateBarProps } from "@/types/propsTypes";

export function SearchSortPaginateBar<T extends string>({
  searchQuery,
  sortBy,
  sortOptions,
  currentPage,
  totalPages,
  onSearchChange,
  onSortChange,
  onPageChange,
}: SearchSortPaginateBarProps<T>) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:items-center justify-between">
      {/* Left: Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Search box */}
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as T)}
          className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Pagination */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
