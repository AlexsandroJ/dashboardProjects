// src/types/userTypes.ts
export interface DeploymentData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec: {
    replicas: number;
    selector: {
      matchLabels: Record<string, string>;
    };
    template: {
      metadata: {
        labels: Record<string, string>;
      };
      spec: {
        containers: {
          name: string;
          image: string;
          ports: { containerPort: number }[];
          env: { name: string | null | undefined; value: string | null | undefined }[];
        }[];
      };
    };
  };
}

export interface ServiceData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec: {
    type: string;
    selector: Record<string, string>;
    ports: {
      protocol: string;
      port: number;
      targetPort: number;
    }[];
  };
}

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

export interface Tenant {
  userId: string;
  deploymentName: string | null;
  servicesName: string | null;
  namespace: string;
  image: string | null;
  replicas: number;
  env: Record<string, string> | null;
  nodePort: string | null;
  status: 'starting' | 'active' | 'paused' | 'deleted' | 'error';
  createdBy: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UserContextType extends UserState {
  
  loading: boolean;
  fetchData: () => Promise<void>;
}