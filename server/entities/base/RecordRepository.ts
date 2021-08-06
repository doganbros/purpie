import { FindManyOptions, Repository } from 'typeorm';

export class RecordRepository<T> extends Repository<T> {
  async paginate(options?: FindManyOptions<T>) {
    const [data, total] = await this.findAndCount(options);

    return {
      data,
      total,
      limit: options?.take,
      skip: options?.skip,
    };
  }
}
