import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { SortDirection, SortField } from '@/hooks/use-table-filters';

export interface SortOption<T> {
  field: SortField<T>;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFiltersProps<T> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortField: SortField<T>;
  sortDirection: SortDirection;
  sortOptions: SortOption<T>[];
  onSortChange: (field: SortField<T>, direction: SortDirection) => void;
  categoryFilter?: string;
  categoryOptions?: FilterOption[];
  onCategoryFilterChange?: (value: string | undefined) => void;
  dateFilter?: string;
  onDateFilterChange?: (value: string | undefined) => void;
  onReset?: () => void;
  className?: string;
}

export function TableFilters<T extends Record<string, any>>({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  sortField,
  sortDirection,
  sortOptions,
  onSortChange,
  categoryFilter,
  categoryOptions,
  onCategoryFilterChange,
  dateFilter,
  onDateFilterChange,
  onReset,
  className,
}: TableFiltersProps<T>) {
  const handleSortClick = (field: SortField<T>) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        onSortChange(field, 'desc');
      } else if (sortDirection === 'desc') {
        onSortChange(null, null);
      } else {
        onSortChange(field, 'asc');
      }
    } else {
      onSortChange(field, 'asc');
    }
  };

  const getSortIcon = (field: SortField<T>) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const hasActiveFilters = search || sortField || categoryFilter || dateFilter;

  // Render filters content (used in both desktop and mobile drawer)
  const renderFiltersContent = () => (
    <>
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="filter-search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      {categoryOptions && onCategoryFilterChange && (
        <div className="space-y-2">
          <Label htmlFor="filter-category">Categoria</Label>
          <Select value={categoryFilter || '__all__'} onValueChange={(value) => onCategoryFilterChange(value === '__all__' ? undefined : value)}>
            <SelectTrigger id="filter-category">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas as categorias</SelectItem>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date Filter */}
      {onDateFilterChange && (
        <div className="space-y-2">
          <Label htmlFor="filter-date">Data</Label>
          <Input
            id="filter-date"
            type="date"
            value={dateFilter || ''}
            onChange={(e) => onDateFilterChange(e.target.value || undefined)}
          />
        </div>
      )}

      {/* Sort Options */}
      <div className="space-y-2">
        <Label>Ordenar por</Label>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={String(option.field)}
              variant={sortField === option.field ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleSortClick(option.field)}
              className="h-9"
            >
              {getSortIcon(option.field)}
              <span className="ml-2">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && onReset && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onReset} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: Full filters visible */}
      <div className={cn('hidden md:flex md:flex-row md:items-center md:justify-between md:gap-3', className)}>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          {categoryOptions && onCategoryFilterChange && (
            <Select value={categoryFilter || '__all__'} onValueChange={(value) => onCategoryFilterChange(value === '__all__' ? undefined : value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas as categorias</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Filter */}
          {onDateFilterChange && (
            <Input
              type="date"
              value={dateFilter || ''}
              onChange={(e) => onDateFilterChange(e.target.value || undefined)}
              className="w-full sm:w-[180px]"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={String(option.field)}
                variant={sortField === option.field ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleSortClick(option.field)}
                className="h-9"
              >
                {getSortIcon(option.field)}
                <span className="ml-2 hidden sm:inline">{option.label}</span>
              </Button>
            ))}
          </div>

          {/* Reset Button */}
          {hasActiveFilters && onReset && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
              <X className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Limpar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile: Filter button with drawer */}
      <div className="flex md:hidden items-center justify-start mb-3 w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Aplique filtros para encontrar o que você procura
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {renderFiltersContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

