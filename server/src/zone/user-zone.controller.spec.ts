import { Test, TestingModule } from '@nestjs/testing';
import { UserZoneController } from './user-zone.controller';

describe('UserZoneController', () => {
  let controller: UserZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserZoneController],
    }).compile();

    controller = module.get<UserZoneController>(UserZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
