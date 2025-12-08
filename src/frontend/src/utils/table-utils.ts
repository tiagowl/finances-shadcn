import type { SortDirection, SortField } from '@/hooks/use-table-filters';

export function filterAndSort<T extends Record<string, any>>(
  items: T[],
  search: string,
  searchFields: (keyof T)[],
  sortField: SortField<T>,
  sortDirection: SortDirection,
  categoryFilter?: string,
  dateFilter?: string,
  categoryField?: keyof T,
  dateField?: keyof T
): T[] {
  let filtered = [...items];

  // Apply search filter
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchLower);
      })
    );
  }

  // Apply category filter
  if (categoryFilter && categoryField) {
    filtered = filtered.filter((item) => item[categoryField] === categoryFilter);
  }

  // Apply date filter
  if (dateFilter && dateField) {
    filtered = filtered.filter((item) => {
      const itemDateValue = item[dateField] as string | Date;
      
      // Normalize item date to YYYY-MM-DD format
      let itemDateStr: string;
      if (itemDateValue instanceof Date) {
        // If it's already a Date object, format it
        const year = itemDateValue.getFullYear();
        const month = String(itemDateValue.getMonth() + 1).padStart(2, '0');
        const day = String(itemDateValue.getDate()).padStart(2, '0');
        itemDateStr = `${year}-${month}-${day}`;
      } else if (typeof itemDateValue === 'string') {
        // If it's a string, extract YYYY-MM-DD part
        // Handle ISO format (2024-01-15T00:00:00.000Z) or date-only (2024-01-15)
        const dateMatch = itemDateValue.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          itemDateStr = dateMatch[1];
        } else {
          // Fallback: try to parse and format
          const parsedDate = new Date(itemDateValue);
          if (!isNaN(parsedDate.getTime())) {
            const year = parsedDate.getUTCFullYear();
            const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getUTCDate()).padStart(2, '0');
            itemDateStr = `${year}-${month}-${day}`;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
      
      // dateFilter is already in YYYY-MM-DD format from the input[type="date"]
      return itemDateStr === dateFilter;
    });
  }

  // Apply sorting
  if (sortField && sortDirection) {
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue && bValue && typeof aValue === 'object' && typeof bValue === 'object' && 'getTime' in aValue && 'getTime' in bValue) {
        const aDate = aValue as Date;
        const bDate = bValue as Date;
        comparison = aDate.getTime() - bDate.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Try to parse as date first
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          comparison = aDate.getTime() - bDate.getTime();
        } else {
          comparison = aValue.localeCompare(bValue);
        }
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  return filtered;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize) || 1;
}

