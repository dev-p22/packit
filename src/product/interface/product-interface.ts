export interface Product {
  name: string;
  price: number;
  category: string;
  description: string;
  brand: string;
}

export enum Category {
  Snacks = 'Snacks',
  Dairy = 'Dairy',
  Beauty = 'Beauty',
  Electronics = 'Electronics',
  Bath = 'Bath',
  Kitchen = 'Kitchen',
}
