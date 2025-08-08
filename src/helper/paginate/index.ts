import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IPaginationOptions, PaginationTypeEnum } from './interface';
import { Pagination } from './pagination';
import { createPaginationObject } from './create-pagination';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

function resolveOptions(options: IPaginationOptions): [number, number, PaginationTypeEnum] {
  const { page, take, paginationType } = options;

  return [
    page || DEFAULT_PAGE,
    take || DEFAULT_LIMIT,
    paginationType || PaginationTypeEnum.TAKE_AND_SKIP,
  ];
}

async function paginateRepository<T, R>(
  repository: Repository<T>,
  options: IPaginationOptions,
  formatResult?: (data: T[]) => R[],
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T> | Pagination<R>> {
  const [page, take] = resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: (page - 1) * take,
      take,
      ...searchOptions,
    }),
    repository.count(searchOptions),
  ];

  const [items, total] = await Promise.all(promises);

  return formatResult
    ? createPaginationObject<R>({
        items: formatResult(items),
        totalItems: total,
        currentPage: page,
        take,
      })
    : createPaginationObject<T>({
        items,
        totalItems: total,
        currentPage: page,
        take,
      });
}

async function paginateQueryBuilder<T, R>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
  formatResult?: (data: T[]) => R[],
): Promise<Pagination<T> | Pagination<R>> {
  const [page, take, paginationType] = resolveOptions(options);

  if (paginationType === PaginationTypeEnum.TAKE_AND_SKIP)
    queryBuilder.take(take).skip((page - 1) * take);
  else queryBuilder.limit(take).offset((page - 1) * take);

  const [items, total] = await queryBuilder.getManyAndCount();

  return formatResult
    ? createPaginationObject<R>({
        items: formatResult(items),
        totalItems: total,
        currentPage: page,
        take,
      })
    : createPaginationObject<T>({
        items,
        totalItems: total,
        currentPage: page,
        take,
      });
}

export async function paginate<T extends ObjectLiteral, R extends Object = T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  formatResult?: (data: T[]) => R[],
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<R>>;
export async function paginate<T, R extends Object = T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
  formatResult?: (data: T[]) => R[],
): Promise<Pagination<R>>;

export async function paginate<T extends ObjectLiteral, R extends Object = T>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  formatResult?: (data: T[]) => R[],
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  if (repositoryOrQueryBuilder instanceof Repository) {
    return paginateRepository<T, R>(repositoryOrQueryBuilder, options, formatResult, searchOptions);
  } else {
    return paginateQueryBuilder<T, R>(repositoryOrQueryBuilder, options, formatResult);
  }
}
