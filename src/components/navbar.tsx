// src/components/navbar.tsx

'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { FC } from 'react';

const Navbar: FC = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              aria-label="홈페이지로 이동"
            >
              <Package className="h-8 w-8" aria-hidden="true" />
              <span className="text-xl font-bold">제품 관리 시스템</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/products" 
              className="hover:text-blue-300 transition-colors font-medium"
              aria-label="제품 목록 페이지로 이동"
            >
              제품 목록
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
