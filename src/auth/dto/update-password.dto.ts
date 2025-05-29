// src/auth/dto/update-password.dto.ts

import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string; // Current password for verification

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(32, { message: 'New password must be at most 32 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'New password too weak. It must contain uppercase, lowercase, number and special character.',
  })
  newPassword: string;
}
