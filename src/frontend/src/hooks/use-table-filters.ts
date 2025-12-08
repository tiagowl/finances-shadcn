import { useState } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export type SortField<T> = keyof T | null;

export interface TableFilters<T> {
  search: string;
  sortField: SortField<T>;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
  categoryFilter?: string;
  dateFilter?: string;
}

export function useTableFilters<T extends Record<string, any>>(
  initialFilters?: Partial<TableFilters<T>>,
  itemsPerPage: number = 10
) {
  const [filters, setFilters] = useState<TableFilters<T>>({
    search: '',
    sortField: null,
    sortDirection: null,
    page: 1,
    pageSize: itemsPerPage,
    ...initialFilters,
  });

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const setSort = (field: SortField<T>, direction: SortDirection) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: direction,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const setCategoryFilter = (categoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, categoryFilter: categoryId, page: 1 }));
  };

  const setDateFilter = (date: string | undefined) => {
    setFilters((prev) => ({ ...prev, dateFilter: date, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sortField: null,
      sortDirection: null,
      page: 1,
      pageSize: itemsPerPage,
      categoryFilter: undefined,
      dateFilter: undefined,
    });
  };

  return {
    filters,
    setSearch,
    setSort,
    setPage,
    setCategoryFilter,
    setDateFilter,
    resetFilters,
  };
}

