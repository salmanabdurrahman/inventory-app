import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seeder.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      // Fix for older MySQL versions that don't support datetime(6)
      legacySpatialSupport: false,
      // SSL configuration for TiDB Cloud Serverless (production only)
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: true,
            }
          : false,
      extra: {
        // Disable fractional seconds precision for compatibility
        dateStrings: true,
      },
    }),
    SuppliersModule,
    ItemsModule,
    UsersModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
