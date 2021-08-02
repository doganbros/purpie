import { Category } from 'entities/Category.entity';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ChildCategories1627488789233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invitation',
      new TableColumn({
        name: 'createdById',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'invitation',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'canDelete',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'zone_role',
      new TableColumn({
        name: 'canEdit',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'canDelete',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'channel_role',
      new TableColumn({
        name: 'canEdit',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.manager.update(
      ZoneRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: true },
    );
    await queryRunner.manager.update(
      ChannelRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: true },
    );

    await queryRunner.query(`DROP TABLE category CASCADE;`);

    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: false,
          },
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'parentCategoryId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.changeColumn(
      'channel',
      'categoryId',
      new TableColumn({
        name: 'categoryId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'zone',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'channel',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'RESTRICT',
      }),
    );

    {
      const rows = [
        'Film & Animation',
        'Autos & Vehicles',
        'Music',
        'Pets & Animals',
        'Sports',
        'Travel & Events',
        'Gaming',
        'People & Blogs',
        'Comedy',
        'Entertainment',
        'News & Politics',
        'Howto & Style',
        'Education',
        'Science & Technology',
        'Nonprofits & Activism',
      ].map((name, i) => ({
        id: i + 1,
        name,
      }));

      await queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Action',
        'Comedy',
        'Drama',
        'Fantasy',
        'Horror',
        'Mystery',
        'Romance',
        'Thriller',
        'Western',
      ].map((name, i) => ({
        id: i + 1001,
        parentCategoryId: 1,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Sedan',
        'Coupe',
        'Sports',
        'Station Wagon',
        'Hatchback',
        'Minivan',
        'Pickup',
      ].map((name, i) => ({
        id: i + 2001,
        parentCategoryId: 2,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Rock',
        'Jazz',
        'Pop',
        'Folk',
        'Hip Hop',
        'Classical',
        'Country',
        'Blues',
        'Electronic',
        'Instrumental',
        'Hymm',
        'Religious',
      ].map((name, i) => ({
        id: i + 3001,
        parentCategoryId: 3,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Dog',
        'Cat',
        'Fish',
        'Bird',
        'Reptiles',
        'Equine',
        'Country',
      ].map((name, i) => ({
        id: i + 4001,
        parentCategoryId: 4,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Football / Soccer',
        'Athletics',
        'Rugby',
        'Combat',
        'Gymnastics',
        'Indoor',
        'Racing',
      ].map((name, i) => ({
        id: i + 5001,
        parentCategoryId: 5,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = ['Business', 'Family', 'Solo', 'Luxury', 'Adventure'].map(
        (name, i) => ({
          id: i + 6001,
          parentCategoryId: 6,
          name,
        }),
      );

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Action',
        'Adventure',
        'Role-playing',
        'Simulation',
        'Strategy',
        'Sports',
        'Puzzle',
        'Idle',
      ].map((name, i) => ({
        id: i + 7001,
        parentCategoryId: 7,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Personal',
        'Business',
        'Professional',
        'Affiliate',
        'Media',
        'Freelance',
      ].map((name, i) => ({
        id: i + 8001,
        parentCategoryId: 8,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = ['Romantic', 'Farce', 'Satire'].map((name, i) => ({
        id: i + 9001,
        parentCategoryId: 9,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }

    {
      const rows = [
        'Circus',
        'Comedy Clubs',
        'Sporting Events',
        'Media',
        'Books',
        'TV Shows',
        'Movies',
      ].map((name, i) => ({
        id: i + 10001,
        parentCategoryId: 10,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
    {
      const rows = ['News', 'Politics'].map((name, i) => ({
        id: i + 11001,
        parentCategoryId: 11,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
    {
      const rows = ['HowTo', 'Style'].map((name, i) => ({
        id: i + 12001,
        parentCategoryId: 12,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
    {
      const rows = ['Formal', 'Informal', 'Non-formal'].map((name, i) => ({
        id: i + 13001,
        parentCategoryId: 13,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
    {
      const rows = [
        'Mathematics',
        'Computer and Information',
        'Physical',
        'Natural',
        'Biological',
        'Software',
        'Hardware',
      ].map((name, i) => ({
        id: i + 14001,
        parentCategoryId: 14,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
    {
      const rows = ['Non Profits', 'Activism'].map((name, i) => ({
        id: i + 15001,
        parentCategoryId: 15,
        name,
      }));

      queryRunner.manager.insert(Category, rows);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE category CASCADE;`);

    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'character varying',
          },
          {
            name: 'parentCategoryId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    const rows = [
      'Film & Animation',
      'Autos & Vehicles',
      'Music',
      'Pets & Animals',
      'Sports',
      'Travel & Events',
      'Gaming',
      'People & Blogs',
      'Comedy',
      'Entertainment',
      'News & Politics',
      'Howto & Style',
      'Education',
      'Science & Technology',
      'Nonprofits & Activism',
    ].map((name, i) => ({
      id: i + 1,
      name,
    }));

    await queryRunner.manager.insert(Category, rows);

    const invitation = await queryRunner.getTable('invitation');

    if (invitation) {
      const foreignKey = invitation.foreignKeys.find((f) =>
        f.columnNames.includes('createdById'),
      );
      if (foreignKey) await queryRunner.dropForeignKey(invitation, foreignKey);

      await queryRunner.dropColumn(invitation, 'createdById');

    }

    await queryRunner.dropColumn('zone_role', 'canEdit');
    await queryRunner.dropColumn('channel_role', 'canEdit');
    await queryRunner.dropColumn('zone_role', 'canDelete');
    await queryRunner.dropColumn('channel_role', 'canDelete');

    await queryRunner.manager.update(
      ZoneRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: false },
    );
    await queryRunner.manager.update(
      ChannelRole,
      { roleCode: 'SUPER_ADMIN' },
      { canDelete: false },
    );
  }
}
