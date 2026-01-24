import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './match/match.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'database.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    MatchModule,
  ],
})
export class AppModule {}
