import { Module } from '@nestjs/common';
import { ArticulosModule } from '../articulos/articulos.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ArticulosModule
  ]
})
export class SeedModule {}
