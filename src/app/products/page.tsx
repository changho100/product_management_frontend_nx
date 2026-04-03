'use client';

import { useState, useEffect } from 'react';
import { productApi, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductForm from '@/components/ProductForm';
import SearchBar from '@/components/SearchBar';
import { Plus, Package, Eye, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('제품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      await productApi.createProduct(productData);
      toast.success('제품이 성공적으로 추가되었습니다.');
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('제품 추가에 실패했습니다.');
    }
  };

  const handleEditProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      if (editingProduct?.id) {
        await productApi.updateProduct(editingProduct.id, productData);
        toast.success('제품이 성공적으로 수정되었습니다.');
        setEditingProduct(null);
        loadProducts();
      }
    } catch (error) {
      console.error('Failed to edit product:', error);
      toast.error('제품 수정에 실패했습니다.');
    }
  };

  const handleSubmitProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      await handleEditProduct(productData);
    } else {
      await handleAddProduct(productData);
    }
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      toast.success('제품이 성공적으로 삭제되었습니다.');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('제품 삭제에 실패했습니다.');
    }
  };

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      loadProducts();
      setSearchKeyword('');
      return;
    }

    try {
      setLoading(true);
      const data = await productApi.searchProducts(keyword);
      setProducts(data);
      setSearchKeyword(keyword);
    } catch (error) {
      console.error('Failed to search products:', error);
      toast.error('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    loadProducts();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">제품 목록</h1>
            {searchKeyword && (
              <p className="text-gray-600 mt-1">
                검색결과: "{searchKeyword}" ({products.length}개)
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>제품 추가</span>
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            initialValue={searchKeyword}
          />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchKeyword ? '검색 결과가 없습니다' : '등록된 제품이 없습니다'}
            </h3>
            <p className="text-gray-500">
              {searchKeyword ? '다른 키워드로 검색해보세요.' : '새로운 제품을 추가해보세요.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">제품명</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">설명</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">가격</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">수량</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">등록일</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {product.price.toLocaleString('ko-KR')}원
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{product.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="상세보기"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditForm(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="수정"
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('정말 삭제하시겠습니까?')) {
                              if (product.id) {
                                handleDeleteProduct(product.id);
                              }
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ProductForm
          isOpen={isFormOpen}
          onSubmit={handleSubmitProduct}
          onClose={handleCloseForm}
          initialData={editingProduct}
        />
      </div>
    </div>
  );
}
