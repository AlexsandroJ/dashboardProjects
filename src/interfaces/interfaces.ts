// interfaces.ts
export interface intens {
    type: string;
    value: number;
    description: string;
    available: boolean;
    image: string;
  }
  
  export interface Category {
    category: string;
    intens: intens[];
  }
  
  export interface Product {
    userId: string;
    products: Category[];
  }