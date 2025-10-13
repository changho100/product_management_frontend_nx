'use client';

import { useState, useEffect } from 'react';
import { productApi, Product } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductForm from '@/components/ProductForm';
import SearchBar from '@/components/SearchBar';
import ProductRow from '@/components/ProductRow';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

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

  const openAddForm = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  };

  const handleFormSubmit = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      if (productToEdit) {
        await productApi.updateProduct(productToEdit.id!, productData);
        toast.success('제품이 성공적으로 수정되었습니다.');
      } else {
        await productApi.createProduct(productData);
        toast.success('제품이 성공적으로 추가되었습니다.');
      }
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(productToEdit ? '제품 수정에 실패했습니다.' : '제품 추가에 실패했습니다.');
    }
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
            onClick={openAddForm}
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
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제품명</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onEdit={openEditForm}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ProductForm
          isOpen={isFormOpen}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          productToEdit={productToEdit}
        />
      </div>
    </div>
  );
}
