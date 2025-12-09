import React from 'react';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CATEGORIES: Category[] = [
  'All Events', 
  'Music', 
  'Sports', 
  'Arts & Theatre', 
  'Festivals'
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="container mx-auto px-6 mb-8">
      <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-3 md:gap-4 py-2 px-1">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`
                whitespace-nowrap px-6 py-2.5 rounded-full font-medium text-sm md:text-base transition-all duration-300 transform hover:-translate-y-0.5
                ${isSelected 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                  : 'glass-effect border border-white/40 md:border-gray-200 bg-white/30 md:bg-white text-gray-700 hover:bg-white hover:shadow-md'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
