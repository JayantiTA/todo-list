import { Module } from '@nestjs/common';
import { AppDataSource } from './data-source';

@Module({
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        return AppDataSource.initialize();
      },
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
