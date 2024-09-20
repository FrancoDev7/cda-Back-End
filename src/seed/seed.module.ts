import { Module } from '@nestjs/common';
import { ArticulosModule } from '../articulos/articulos.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ArticulosModule,
    AuthModule
  ]
})
export class SeedModule {}
