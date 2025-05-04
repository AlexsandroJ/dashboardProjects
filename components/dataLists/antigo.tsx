"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faPen,
  faSave,
  faTimes,
  faPlus,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// Interfaces
interface Item {
  name: string;
  type: string;
  price: number;
  description: string;
  available: boolean;
  image: string;
  stock: number;
}

interface Category {
  category: string;
  items: Item[];
}

const UserEmail = "ajs6@gmail.com";
const userId = "6810e8fde1c0d0c4f29a3431";

const NotesList = () => {
  const api = axios.create({
    baseURL: "http://localhost:3001", // URL do backend
  });

  // Estados tipados
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState<Category>({
    category: "",
    items: [],
  });
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});
  const [newItem, setNewItem] = useState<Item>({
    name: "",
    type: "",
    price: 0,
    description: "",
    available: true,
    image: "",
    stock: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  // Função para buscar categorias e itens
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

  // Adicionar nova categoria
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post(`/api/category/${userId}`, {
        userId: userId,
        category: newCategory.category,
      });
      setNewCategory({ category: "", items: [] });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  // Editar categoria
  const handleEditCategory = async (categoryId: string) => {
    
    try {
      await api.put(`/api/category/${userId}`, {
        userId: userId,
        oldCategory: categoryId,
        newCategory: editedCategoryName,
      });
      setEditingCategory(null);
      setEditedCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
    }
  };

  // Excluir categoria
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await api.delete(`/api/category/${userId}/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  // Adicionar novo item a uma categoria
  const handleAddItem = async (categoryId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post(`/api/items/${userId}/${categoryId}`, newItem);
      setNewItem({
        name: "",
        type: "",
        price: 0,
        description: "",
        available: true,
        image: "",
        stock: 0,
      });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  // Excluir item
  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    try {
      await api.delete(`/api/items/${userId}/${categoryId}/${itemId}`);
      fetchCategories();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };

  // Editar item
  const handleEditItem = async (categoryId: string, itemId: string) => {
    try {
      if (editedItem) {
        await api.put(`/api/items/${userId}/${categoryId}/${itemId}`, editedItem);
        setEditingIndex(null);
        setEditedItem(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Erro ao editar item:", error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (id: number) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center p-4 mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
        Produtos
      </h2>
      {/* Formulário para adicionar nova categoria */}
      <form onSubmit={handleAddCategory} className="p-4 border rounded-lg shadow-md sm:p-6">
        <div>
          <label className="block font-medium mb-2">
            Nome da Categoria:
            <input
              type="text"
              value={newCategory.category}
              onChange={(e) =>
                setNewCategory({ ...newCategory, category: e.target.value })
              }
              className="w-full p-2 border rounded sm:p-3"
              placeholder="Digite o nome da nova categoria"
              required
            />
          </label>
        </div>
        <button type="submit">
          <FontAwesomeIcon
            size="2x"
            icon={faPlus}
            className="hover:text-blue-600 cursor-pointer h-8 w-8"
          />
        </button>
      </form>
      <h2 className="text-2xl font-bold text-center p-4 mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
        Categorias
      </h2>
      {/* Lista de Categorias */}
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index}>
            <div className="mt-4">
              <div className="flex items-center justify-between space-x-2">
                {/* Campo de edição de Categorias */}
                {editingCategory === category.category ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="w-full p-2 border rounded sm:p-3"
                      placeholder="Digite o novo nome da categoria"
                      required
                    />
                    {/* Salvar Categoria */}
                    <FontAwesomeIcon
                      size="lg"
                      icon={faSave}
                      className="hover:text-blue-600 cursor-pointer h-6 w-6"
                      onClick={() => handleEditCategory(category.category)}
                    />
                     {/* Fechar Categoria */}
                    <FontAwesomeIcon
                      size="lg"
                      icon={faTimes}
                      className="hover:text-red-600 cursor-pointer h-6 w-6"
                      onClick={() => {
                        setEditingCategory(null);
                        setEditedCategoryName("");
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    {/* Ediçao de Categoria */}
                  <FontAwesomeIcon
                    size="lg"
                    icon={faPen}
                    className="hover:text-blue-600 cursor-pointer h-6 w-6"
                    onClick={() => {
                      setEditingCategory(category.category);
                      setEditedCategoryName(category.category);
                    }}
                  />
                  </div>
                )}
                {/* toggleDropdown Nome da categoria */}
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
                >
                  <span>{category.category}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-300 ${
                      openDropdowns[index] ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {/* Ícone de Remover */}
                <FontAwesomeIcon
                  size="lg"
                  icon={faTrash}
                  className="hover:text-red-600 cursor-pointer h-6 w-6"
                  onClick={() => handleDeleteCategory(category.category)}
                />
              </div>
            </div>
            {openDropdowns[index] && (
              <ul className="space-y-4 p-4">
                {/* Formulário para adicionar novo item */}
                <form
                  onSubmit={(e) => handleAddItem(category.category, e)}
                  className="p-4 border rounded-lg shadow-md sm:p-6"
                >
                  <div>
                    <label className="block font-medium mb-2">
                      Nome:
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite o nome do item"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Tipo:
                      <input
                        type="text"
                        value={newItem.type}
                        onChange={(e) =>
                          setNewItem({ ...newItem, type: e.target.value })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite o tipo do item"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Preço:
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: Number(e.target.value) })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite o preço do item"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Descrição:
                      <input
                        type="text"
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({ ...newItem, description: e.target.value })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite a descrição do item"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Estoque:
                      <input
                        type="number"
                        value={newItem.stock}
                        onChange={(e) =>
                          setNewItem({ ...newItem, stock: Number(e.target.value) })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite a quantidade em estoque"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">
                      Link da Imagem:
                      <input
                        type="text"
                        value={newItem.image}
                        onChange={(e) =>
                          setNewItem({ ...newItem, image: e.target.value })
                        }
                        className="w-full p-2 border rounded sm:p-3"
                        placeholder="Digite o link da imagem"
                      />
                    </label>
                  </div>
                  <button type="submit">
                    <FontAwesomeIcon
                      size="2x"
                      icon={faPlus}
                      className="hover:text-blue-600 cursor-pointer h-8 w-8"
                    />
                  </button>
                </form>
                {/* Lista de Itens */}
                {category.items.length > 0 ? (
                  category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="p-4 border rounded-lg shadow-md hover:bg-yellow-400 sm:p-6"
                    >
                      {editingIndex === itemIndex ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditItem(category.category, item.name);
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block font-medium">
                              <strong>Nome:</strong>
                              <input
                                type="text"
                                value={editedItem?.name || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite o nome do item"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium">
                              <strong>Tipo:</strong>
                              <input
                                type="text"
                                value={editedItem?.type || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    type: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite o tipo do item"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium">
                              <strong>Preço:</strong>
                              <input
                                type="number"
                                value={editedItem?.price || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    price: Number(e.target.value),
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite o preço do item"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium">
                              <strong>Descrição:</strong>
                              <input
                                type="text"
                                value={editedItem?.description || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    description: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite a descrição do item"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium">
                              <strong>Estoque:</strong>
                              <input
                                type="number"
                                value={editedItem?.stock || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    stock: Number(e.target.value),
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite a quantidade em estoque"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="block font-medium">
                              <strong>Link da Imagem:</strong>
                              <input
                                type="text"
                                value={editedItem?.image || ""}
                                onChange={(e) =>
                                  setEditedItem((prev) => ({
                                    ...(prev || item),
                                    image: e.target.value,
                                  }))
                                }
                                className="w-full p-2 border rounded sm:p-3"
                                placeholder="Digite o link da imagem"
                              />
                            </label>
                          </div>
                          <div className="flex flex-row justify-between space-y-2">
                            <button type="submit">
                              <FontAwesomeIcon
                                size="2x"
                                icon={faSave}
                                className="hover:text-blue-600 cursor-pointer h-8 w-8"
                              />
                            </button>
                            <FontAwesomeIcon
                              size="2x"
                              icon={faTimes}
                              className="hover:text-red-600 cursor-pointer h-8 w-8"
                              onClick={() => {
                                setEditingIndex(null);
                                setEditedItem(null);
                              }}
                            />
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={`Imagem de ${item.name}`}
                              className="w-16 h-16 object-cover rounded-full"
                            />
                            <div className="flex flex-col justify-between">
                              <div className="font-medium">{item.name}</div>
                              <div className="font-medium">
                                <strong>R$</strong> {item.price}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row justify-between space-y-2">
                            <FontAwesomeIcon
                              size="2x"
                              icon={faPen}
                              className="hover:text-blue-600 cursor-pointer h-8 w-8"
                              onClick={() => {
                                setEditingIndex(itemIndex);
                                setEditedItem(item);
                              }}
                            />
                            <FontAwesomeIcon
                              size="2x"
                              icon={faTrash}
                              className="hover:text-red-600 cursor-pointer h-8 w-8"
                              onClick={() =>
                                handleDeleteItem(category.category, item.name)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-center sm:text-lg md:text-xl lg:text-2xl">
                    Nenhum item encontrado.
                  </p>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;