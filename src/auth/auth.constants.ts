// src/auth/auth.constants.ts

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'defaultSecretKey',  // fallback secret
};

// You can also add other constants here if needed
// export const someOtherConstant = 'someValue';
