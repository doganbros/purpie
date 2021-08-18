import { paginate } from 'helpers/utils';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginationQuery, PaginationResponse } from 'types/PaginationQuery';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      query: PaginationQuery,
    ): Promise<PaginationResponse<Entity>>;

    paginateRaw(
      this: SelectQueryBuilder<Entity>,
      query: PaginationQuery,
      primaryCount?: boolean,
    ): Promise<PaginationResponse<Record<string, any>>>;
  }
}

SelectQueryBuilder.prototype.paginate = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  query: PaginationQuery,
): Promise<PaginationResponse<Entity>> {
  const result = await this.skip(query.skip)
    .take(query.limit)
    .getManyAndCount();

  return paginate<Entity>(result, query);
};

SelectQueryBuilder.prototype.paginateRaw = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  query: PaginationQuery,
  primaryCount = true,
): Promise<PaginationResponse<Record<string, any>>> {
  const result = await Promise.all([
    this.offset(query.skip).limit(query.limit).getRawMany(),
    primaryCount
      ? this.getCount()
      : this.select('count(*)', 'totalRecords')
          .limit(undefined)
          .offset(undefined)
          .getRawOne()
          .then((res) => res && Number.parseInt(res.totalRecords, 10)),
  ]);

  return paginate<Record<string, any>>(result as any, query);
};
