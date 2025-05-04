"use client";
import React, { useState } from "react";
import axios from "axios";
import AddItemForm from "./AddItemForm";
import EditableItem from "./EditableItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

interface CategoryItemProps {
  category: any;
  fetchCategories: () => void;
}

const CategoryItem = ({ category, fetchCategories }: CategoryItemProps) => {
  const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>(""); // Novo estado para o valor do input

  const handleEditCategory = async () => {
    if (newCategoryName.trim() !== "") {
      await api.put(`/api/category/${userId}`, {
        userId: userId,
        oldCategory: category.category,
        newCategory: newCategoryName,
      });
      setEditingCategory(null);
      setNewCategoryName(""); // Limpa o campo de input
      fetchCategories();
    }
  };

  const handleDeleteCategory = async () => {
    await api.delete(`/api/category/${userId}/${category.category}`);
    fetchCategories();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col justify-between space-x-2">
        {editingCategory === category.category ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)} // Atualiza o novo estado
              className="w-full p-2 border rounded"
              placeholder="Digite o novo nome da categoria"
              required
            />
            
            <FontAwesomeIcon
              icon={faSave}
              className="hover:text-blue-600 cursor-pointer h-6 w-6"
              onClick={handleEditCategory}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="hover:text-red-600 cursor-pointer h-6 w-6"
              onClick={() => {
                setEditingCategory(null);
                setNewCategoryName(""); // Limpa o campo de input ao cancelar
              }}
            />
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
            >
              <span>{category.category}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-transform duration-300 ${openDropdown ? "transform rotate-180" : ""}`}
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between space-x-2">
            <FontAwesomeIcon
              icon={faPen}
              className="hover:text-blue-600 cursor-pointer h-6 w-6"
              onClick={() => {
                setEditingCategory(category.category);
                setNewCategoryName(category.category); // Inicializa o input com o nome atual da categoria
              }}
            />
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
            >
              <span>{category.category}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-transform duration-300 ${openDropdown ? "transform rotate-180" : ""}`}
              />
            </button>

            <FontAwesomeIcon
              icon={faTrash}
              className="hover:text-red-600 cursor-pointer h-6 w-6"
              onClick={handleDeleteCategory}
            />
          </div>
        )}
      </div>
      {openDropdown && (
        <div className="p-4">
          <AddItemForm category={category.category} fetchCategories={fetchCategories} />
          <ul className="space-y-4">
            {category.items.length > 0 ? (
              category.items.map((item, index) => (
                <div
                  className="p-4 border rounded-lg shadow-md hover:bg-yellow-400 sm:p-6"
                  key={index}
                >
                  <EditableItem
                    item={item}
                    category={category.category}
                    fetchCategories={fetchCategories}
                  />
                </div>
              ))
            ) : (
              <p>Nenhum item encontrado.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;