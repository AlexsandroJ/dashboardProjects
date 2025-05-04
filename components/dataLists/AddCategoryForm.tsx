// AddCategoryForm.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface AddCategoryFormProps {
  fetchCategories: () => void;
}

const AddCategoryForm = ({ fetchCategories }: AddCategoryFormProps) => {


  const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL:  process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });


  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.post(`/api/category/${userId}`, { userId: userId ,category: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  return (
    <form onSubmit={handleAddCategory} className="p-4 border rounded-lg shadow-md">
      <label className="block font-medium mb-2">
        Nome da Categoria:
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Digite o nome da nova categoria"
          required
        />
      </label>
      <button type="submit">
        <FontAwesomeIcon icon={faPlus} className="hover:text-blue-600 cursor-pointer h-8 w-8" />
      </button>
    </form>
  );
};

export default AddCategoryForm;