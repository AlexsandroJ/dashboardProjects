"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCategoryForm from "./AddCategoryForm";
import AddCityForm from "./AddCityForm";
import CategoryItem from "./CategoryItem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPen,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// Interfaces
interface Category {
  category: string;
  items: any[];
}

interface Neighborhood {
  name: string;
}

interface City {
  _id?: string;
  name: string;
  neighborhoods: Neighborhood[];
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Controle do modo edição
  const [editValue, setEditValue] = useState<string>(""); // Valor do input
  //let userId = process.env.NEXT_PUBLIC_USERID;
  let userId;
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });

  const fetchCategories = async () => {

    const email = "alex@example.com";
    const password = "password321";
    let token = "";

    try {
      const sessionRes = await api.post(`/api/sessions/login`, {
        email,
        password,
      });
      token = sessionRes.data.token;
      userId = sessionRes.data.userId;

      const cityRes = await api.get<{ cities: City[] }>(
        `/api/cities/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      const response = await api.get<{ categories: Category[] }>(
        `/api/category/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setCategories(response.data.categories);
      setCities(cityRes.data.cities);

    } catch (err: any) {
      console.error(
        "Erro ao buscar Dados:",
        err.response?.data || err.message
      );
    }
  };

  const toggleDropdown = (index: number) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Iniciar modo de edição
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditValue(cities[index].name);
  };

  // Salvar alteração da cidade
  const handleSaveEdit = async (index: number) => {
    if (!editValue.trim()) return;

    const cityId = cities[index]._id;

    try {
      await api.put(
        `/api/cities/${cityId}`,
        { name: editValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const updatedCities = [...cities];
      updatedCities[index].name = editValue;
      setCities(updatedCities);
      setEditingIndex(null);
    } catch (error) {
      console.error("Erro ao atualizar cidade:", error);
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  // Remover cidade
  const handleDeleteCity = async (index: number) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta cidade?"
    );
    if (!confirmDelete) return;

    const cityId = cities[index]._id;

    try {
      await api.delete(`/api/cities/${cityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const updatedCities = cities.filter((_, i) => i !== index);
      setCities(updatedCities);
    } catch (error) {
      console.error("Erro ao excluir cidade:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-2">
      {/* Cidades e Bairros com Toggle */}
      <h2 className="text-2xl font-bold text-center p-4 mt-8 mb-4">
        Cidades e Bairros
      </h2>
      <AddCityForm fetchCategories={fetchCategories} />
      {cities.length > 0 ? (
        <div className="space-y-4">
          {cities.map((city, index) => (
            <div key={index}>
              <div className="mt-4">
                <div className="flex flex-col justify-between space-x-2">
                  {editingIndex === index ? (
                    <div className="flex  items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-grow p-2 border rounded"
                        placeholder="Nome da cidade"
                      />
                      <FontAwesomeIcon
                        icon={faSave}
                        className="hover:text-blue-600  cursor-pointer h-6 w-6"
                        onClick={() => handleSaveEdit(index)}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="hover:text-red-600 cursor-pointer h-6 w-6"
                        onClick={handleCancelEdit}
                      />
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
                      >
                        <span>{city.name}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`transition-transform duration-300 ${dropdownOpen[index] ? "transform rotate-180" : ""
                            }`}
                        />
                      </button>

                    </div>
                  ) : (
                    <div className="flex justify-between items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faPen}
                        className="hover:text-blue-600 cursor-pointer h-6 w-6"
                        onClick={() => handleEditClick(index)}
                      />
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
                      >
                        <span>{city.name}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`transition-transform duration-300 ${dropdownOpen[index] ? "transform rotate-180" : ""
                            }`}
                        />
                      </button>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="hover:text-red-600 cursor-pointer h-6 w-6"
                        onClick={() => handleDeleteCity(index)}
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Dropdown - Mostra bairros apenas se estiver aberto */}
              {dropdownOpen[index] && (
                <ul className="ml-5 list-disc mt-2 space-y-1">
                  {city.neighborhoods.map((neighborhood, idx) => (
                    <li key={idx}>{neighborhood.name}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Nenhuma cidade encontrada.</p>
      )}

      {/* Categorias */}
      <h2 className="text-2xl font-bold text-center p-4 mb-4">Produtos</h2>
      <AddCategoryForm fetchCategories={fetchCategories} />
      <h2 className="text-2xl font-bold text-center p-4 mb-4">Categorias</h2>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index}>
            <CategoryItem
              key={index}
              category={category}
              fetchCategories={fetchCategories}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;