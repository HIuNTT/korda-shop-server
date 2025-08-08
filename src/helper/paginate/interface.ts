import { ObjectLiteral } from 'typeorm';

export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface IPaginationOptions {
  page: number;
  take: number;
  paginationType?: PaginationTypeEnum;
}

export interface IPaginationMeta extends ObjectLiteral {
  total_count?: number;
  page_size: number;
  total_pages?: number;
  current_page: number;
}
