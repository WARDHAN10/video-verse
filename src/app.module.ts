import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './utils/helpers/guards/auth.guard';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService,  
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Apply the AuthGuard globally
    },
  ],
})
export class AppModule {}
