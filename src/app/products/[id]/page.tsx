'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductForm from '@/components/ProductForm';
import { ArrowLeft, Trash2, Package, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProductById(Number(params.id));
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('제품을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await productApi.deleteProduct(product.id!);
      toast.success('제품이 성공적으로 삭제되었습니다.');
      router.push('/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('제품 삭제에 실패했습니다.');
    }
  };

  const handleFormSubmit = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!product) return;
    try {
      await productApi.updateProduct(product.id!, productData);
      toast.success('제품이 성공적으로 수정되었습니다.');
      setIsEditFormOpen(false);
      loadProduct(); // 수정된 정보 다시 불러오기
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('제품 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">제품을 찾을 수 없습니다</h3>
            <p className="text-gray-500 mb-6">요청한 제품이 존재하지 않습니다.</p>
            <button
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              제품 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/products')}
            className="btn-outline flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditFormOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>수정</span>
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>삭제</span>
            </button>
          </div>
        </div>

        <div className="card p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>ID: {product.id}</span>
              {product.createdAt && (
                <span>등록일: {new Date(product.createdAt).toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">제품 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">가격</label>
                  <div className="text-2xl font-bold text-green-600">
                    {product.price.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">재고 수량</label>
                  <div className="text-xl font-semibold text-blue-600">
                    {product.quantity}개
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">제품 설명</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || '설명이 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleFormSubmit}
        productToEdit={product}
      />
    </div>
  );
}
