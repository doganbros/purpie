import { parseRawMany } from 'helpers/parseTypeOrmRaw';
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
      parseRawOptions?: {
        primaryAlias: string;
        aliases?: Array<string>;
        idColumnName?: string;
        arrayAliases?: Array<string>;
      },
    ): Promise<PaginationResponse<Record<string, any>>>;

    whereExists<T>(query: SelectQueryBuilder<T>): this;
    andWhereExists<T>(query: SelectQueryBuilder<T>): this;
    orWhereExists<T>(query: SelectQueryBuilder<T>): this;
  }

  // interface WhereExpression {
  //   whereExists<T>(query: SelectQueryBuilder<T>): this;
  //   andWhereExists<T>(query: SelectQueryBuilder<T>): this;
  //   orWhereExists<T>(query: SelectQueryBuilder<T>): this;
  // }
}

SelectQueryBuilder.prototype.paginate = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  query: PaginationQuery,
): Promise<PaginationResponse<Entity>> {
  const result = await this.offset(query.skip)
    .limit(query.limit)
    .getManyAndCount();

  return paginate<Entity>(result, query);
};

SelectQueryBuilder.prototype.paginateRaw = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  query: PaginationQuery,
  parseRawOptions: {
    primaryAlias: string;
    aliases?: Array<string>;
    idColumnName?: string;
    arrayAliases?: Array<string>;
  },
): Promise<PaginationResponse<Record<string, any>>> {
  const result = await Promise.all([
    this.offset(query.skip).limit(query.limit).getRawMany(),

    this.getCount(),
  ]);

  if (parseRawOptions) {
    result[0] = parseRawMany(
      result[0],
      parseRawOptions.primaryAlias,
      parseRawOptions.aliases || [],
      parseRawOptions.idColumnName || 'id',
      parseRawOptions.arrayAliases || [],
    );
  }

  return paginate<Record<string, any>>(result, query);
};
