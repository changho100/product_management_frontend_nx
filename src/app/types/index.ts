export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
}