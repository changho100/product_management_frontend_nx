// src/components/ProductRow.tsx

'use client';

import { Product } from '@/lib/api';
import { Eye, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { FC, useCallback } from 'react';

interface ProductRowProps {
  product: Product;
  onDelete: (id: number) => Promise<void> | void;
  onEdit: (product: Product) => void;
}

const ProductRow: FC<ProductRowProps> = ({ product, onDelete, onEdit }) => {
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{product.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.name}</td>
      <td className="px-6 py-4 text-sm text-right text-gray-900">{formatPrice(product.price)}원</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{product.quantity}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(product.createdAt)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <Link
            href={`/products/${product.id}`}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            aria-label={`${product.name} 상세보기`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={handleEdit}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            aria-label={`${product.name} 수정`}
            type="button"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            aria-label={`${product.name} 삭제`}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;