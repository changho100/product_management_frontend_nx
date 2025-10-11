'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  onClear: () => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "제품명으로 검색...",
  initialValue = ""
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="input-field pr-10"
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}