// CategoryList.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCategoryForm from "./AddCategoryForm";
import CategoryItem from "./CategoryItem";

interface Category {
  category: string;
  items: any[];
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL:  process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });
  const fetchCategories = async () => {
    try {
      const response = await api.get<{ categories: Category[] }>(`/api/category/${userId}`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center p-4 mb-4">Produtos</h2>
      <AddCategoryForm fetchCategories={fetchCategories} />
      <h2 className="text-2xl font-bold text-center p-4 mb-4">Categorias</h2>
      <div className="space-y-4">
        {categories.map((category, index) => (
         
          <CategoryItem
            key={index}
            category={category}
            fetchCategories={fetchCategories}
          />
          
        ))}
      </div>
    </div>
  );
};

export default CategoryList;