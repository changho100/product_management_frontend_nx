// src/components/ProductCard.tsx

'use client';

import { Product } from '@/lib/api';
import { Eye, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { FC, useCallback } from 'react';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => Promise<void> | void;
  onEdit: (product: Product) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
  const handleDelete = useCallback(() => {
    if (window.confirm(`'${product.name}' 제품을 정말 삭제하시겠습니까?`)) {
      if (product.id) {
        onDelete(product.id);
      }
    }
  }, [product.id, product.name, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(product);
  }, [product, onEdit]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 truncate" title={product.name}>
          {product.name}
        </h3>
        <div className="flex space-x-2">
          <Link 
            href={`/products/${product.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`${product.name} 상세보기`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            onClick={handleEdit}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            aria-label={`${product.name} 수정`}
            type="button"
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`${product.name} 삭제`}
            type="button"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 h-12 overflow-hidden" title={product.description || '설명이 없습니다.'}>
        {product.description || '설명이 없습니다.'}
      </p>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}원
          </span>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {product.quantity}개
        </div>
      </div>
      
      {product.createdAt && (
        <div className="mt-3 text-sm text-gray-500">
          등록일: {formatDate(product.createdAt)}
        </div>
      )}
    </div>
  );
};

export default ProductCard; 
