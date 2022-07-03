import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';

@Module({
  providers: [BikeService],
  controllers: [BikeController]
})
export class BikeModule {}
