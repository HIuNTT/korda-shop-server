import { IPaginationMeta } from './interface';
import { Pagination } from './pagination';

export function createPaginationObject<T>({
  items,
  totalItems,
  currentPage,
  take,
}: {
  items: T[];
  totalItems?: number;
  currentPage: number;
  take: number;
}): Pagination<T> {
  const totalPages = totalItems !== undefined ? Math.ceil(totalItems / take) : undefined;

  const meta: IPaginationMeta = {
    total_count: totalItems,
    page_size: take,
    total_pages: totalPages,
    current_page: currentPage,
  };

  return new Pagination<T>(items, meta);
}
