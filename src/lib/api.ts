import axios, { AxiosResponse } from 'axios';

const API_BASE_URL: string = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:8080' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt?: string;
}

export interface ProductCreateRequest extends Omit<Product, 'id' | 'createdAt'> {}

export const productApi = {
  // 모든 제품 조회
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response: AxiosResponse<Product[]> = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('제품 목록을 불러오는데 실패했습니다.');
    }
  },

  // 제품 ID로 조회
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response: AxiosResponse<Product> = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error('제품 정보를 불러오는데 실패했습니다.');
    }
  },

  // 제품 추가
  createProduct: async (product: ProductCreateRequest): Promise<Product> => {
    try {
      const response: AxiosResponse<Product> = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error('제품 생성에 실패했습니다.');
    }
  },

  // 제품 수정
  updateProduct: async (id: number, product: ProductCreateRequest): Promise<Product> => {
    try {
      const response: AxiosResponse<Product> = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw new Error('제품 수정에 실패했습니다.');
    }
  },

  // 제품 삭제
  deleteProduct: async (id: number): Promise<void> => {
    try {
      await api.post(`/products/${id}/delete`);
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw new Error('제품 삭제에 실패했습니다.');
    }
  },

  // 제품 검색
  searchProducts: async (keyword: string): Promise<Product[]> => {
    try {
      const response: AxiosResponse<Product[]> = await api.get(
        `/products/search?keyword=${encodeURIComponent(keyword)}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw new Error('제품 검색에 실패했습니다.');
    }
  },
};

export default api;
