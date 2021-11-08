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

    paginateRawAndEntities(
      this: SelectQueryBuilder<Entity>,
      options: {
        otherFields: Array<string>;
        primaryColumnName: string;
        primaryTableAliasName: string;
        skipAndTake?: boolean;
      },
      query: PaginationQuery,
    ): Promise<PaginationResponse<Record<string, any>>>;

    getRawOneAndEntity(
      otherFields: Array<string>,
      primaryTableAliasName: string,
    ): Promise<Record<string, any> | null>;
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

SelectQueryBuilder.prototype.paginateRawAndEntities = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  options: {
    otherFields: Array<string>;
    primaryColumnName: string;
    skipAndTake?: boolean;
    primaryTableAliasName: string;
  },
  query: PaginationQuery,
): Promise<PaginationResponse<Entity>> {
  const {
    skipAndTake,
    otherFields,
    primaryColumnName,
    primaryTableAliasName,
  } = options;
  const [rawAndEntities, total] = await Promise.all([
    skipAndTake
      ? this.skip(query.skip).take(query.limit).getRawAndEntities()
      : this.offset(query.skip).limit(query.limit).getRawAndEntities(),
    this.getCount(),
  ]);

  const result: [data: Entity[], total: number] = [
    rawAndEntities.entities.map((v) => ({
      ...v,
      ...otherFields.reduce(
        (acc, otherField) => ({
          ...acc,
          [otherField]: rawAndEntities.raw.find(
            (re: any) =>
              re[`${primaryTableAliasName}_${primaryColumnName}`] ===
              (v as any)[primaryColumnName],
          )?.[`${primaryTableAliasName}_${otherField}`],
        }),
        {},
      ),
    })),
    total,
  ];

  return paginate<Entity>(result, query);
};

SelectQueryBuilder.prototype.getRawOneAndEntity = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  otherFields: Array<string>,
  primaryTableAliasName: string,
): Promise<Record<string, any> | null> {
  const [entityResult, rawResult] = await Promise.all([
    this.getOne(),
    this.getRawOne(),
  ]);

  if (!entityResult) return null;

  return {
    ...entityResult,
    ...otherFields.reduce(
      (acc, otherField) => ({
        ...acc,
        [otherField]: rawResult?.[`${primaryTableAliasName}_${otherField}`],
      }),
      {},
    ),
  };
};
