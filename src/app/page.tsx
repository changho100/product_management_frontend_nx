import Link from 'next/link';
import { Package, ArrowRight, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '제품 관리 시스템 - 홈',
  description: 'Next.js와 Spring Boot로 구축된 현대적인 제품 관리 시스템',
};

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 p-4 rounded-full">
              <Package className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            제품 관리 시스템
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Next.js와 Spring Boot로 구축된 현대적인 제품 관리 시스템입니다. 
            제품을 쉽게 추가, 조회, 검색, 삭제할 수 있습니다.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="/products" 
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>제품 관리 시작하기</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">제품 관리</h3>
            <p className="text-gray-600">제품을 쉽게 추가하고 관리할 수 있습니다.</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">빠른 검색</h3>
            <p className="text-gray-600">제품명으로 원하는 제품을 빠르게 찾을 수 있습니다.</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">현대적 UI</h3>
            <p className="text-gray-600">직관적이고 반응형 사용자 인터페이스를 제공합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
