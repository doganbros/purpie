import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class ZoneCategoryRelationUpdate1663092054560 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('zone', 'categoryId', new TableColumn({
            name: 'categoryId',
            isNullable: true,
            type: 'integer'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
