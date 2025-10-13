'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Product } from '@/lib/api';
import { X } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  isOpen: boolean;
  productToEdit?: Product | null;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ProductForm({ onSubmit, onClose, isOpen, productToEdit }: ProductFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!productToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && productToEdit) {
        setValue('name', productToEdit.name);
        setValue('description', productToEdit.description || '');
        setValue('price', productToEdit.price);
        setValue('quantity', productToEdit.quantity);
      } else {
        reset();
      }
    }
  }, [isOpen, isEditMode, productToEdit, setValue, reset]);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? '제품 수정' : '새 제품 추가'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제품명 *
            </label>
            <input
              type="text"
              {...register('name', { required: '제품명은 필수입니다.' })}
              className="input-field"
              placeholder="제품명을 입력하세요"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field resize-none"
              placeholder="제품 설명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('price', { 
                  required: '가격은 필수입니다.',
                  min: { value: 0, message: '가격은 0 이상이어야 합니다.' }
                })}
                className="input-field"
                placeholder="0"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수량 *
              </label>
              <input
                type="number"
                min="0"
                {...register('quantity', { 
                  required: '수량은 필수입니다.',
                  min: { value: 0, message: '수량은 0 이상이어야 합니다.' }
                })}
                className="input-field"
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : (isEditMode ? '수정 완료' : '저장')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
