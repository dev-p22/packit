export interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

export enum sortByPriceEnum {
  asc = 'asc',
  desc = 'desc',
}
