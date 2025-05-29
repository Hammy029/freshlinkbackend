// src/auth/entities/register.entity.ts
//this code will not be used since i am usong schema meaning it can be later used if i go for sql

export class Register {
  username: string;
  email: string;
  phone_no: string;
  password: string;
  role?: string; // optional, defaults to 'user'
}
