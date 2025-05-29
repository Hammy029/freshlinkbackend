// src/auth/dto/reset-password.dto.ts

import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string; // The reset token sent by email

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  // Example: At least one uppercase letter, one lowercase letter, one number and one special character
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password too weak. It must contain uppercase, lowercase, number and special character.',
  })
  newPassword: string;
}
