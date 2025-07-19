declare global {
  interface IAuthUser {
    uid: number;
    role: string;
    exp?: number;
    iat?: number;
  }
}

export {};
