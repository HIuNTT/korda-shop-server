import { Module } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
@Module({
  imports: [AuthService],
})
export class AppModule {}
