// src/types/userTypes.ts

export interface Item {
  name: string;
  type: string;
  price: number;
  description?: string; // Opcional
  available?: boolean; // Opcional
  image?: string; // URL da imagem (opcional)
  stock?: number; // Estoque (opcional)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  category: string;
  items: Item[];
}

export interface Neighborhood {
  name: string;
}

export interface City {
  _id?: string;
  name: string;
  neighborhoods: Neighborhood[];
}

export interface Profile {
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  age: number | null;
}

export interface User {
  name: string | null;
  phone: string[] | null;
}

export interface UserState {
  categories: Category[];
  cities: City[];
  userId: string | null;
  user: User | null;
  profile: Profile | null;
  token: string | null;
  qrCode: string | null;
}

export interface UserContextType extends UserState {
  
  loading: boolean;
  fetchData: () => Promise<void>;
}