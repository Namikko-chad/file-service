export interface IAuthToken {
  userId: string;
  timestamp: number;
}

export interface Ijwt {
  access?: string;
  refresh?: string;
  fileAccess?: string;
}
