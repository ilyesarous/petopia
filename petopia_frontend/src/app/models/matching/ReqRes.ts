
// src/app/models/req-res.ts
export interface ReqRes {
    statusCode: number;
    message: string;
    ourUsersList?: { id_user: number; name: string; email?: string }[];
  }