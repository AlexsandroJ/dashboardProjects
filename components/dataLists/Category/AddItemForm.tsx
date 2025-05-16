// AddItemForm.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


interface AddItemFormProps {
  category: string;
  fetchData: () => void;
  userId: string;
}

const AddItemForm = ({ category, fetchData, userId }: AddItemFormProps) => {
  //const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });
  const [newItem, setNewItem] = useState({
    name: "",
    type: "",
    price: 0,
    description: "",
    available: true,
    image: "",
    stock: 0,
  });

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post(`/api/items/${userId}/${category}`, newItem);
      setNewItem({
        name: "",
        type: "",
        price: 0,
        description: "",
        available: true,
        image: "",
        stock: 0,
      });
      fetchData();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  return (
    <form onSubmit={handleAddItem} className="p-4 border rounded-lg shadow-md space-y-4">
      {/* Campo Disponível */}
      <div>
        <label className="flex items-center space-x-2 font-medium">
          <input
            type="checkbox"
            checked={newItem.available}
            onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Disponível</span>
        </label>
      </div>

      {/* Campo Nome */}
      <div>
        <label className="block font-medium mb-1">Nome:</label>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Digite o nome do item"
          required
        />
      </div>

      {/* Campo Tipo */}
      <div>
        <label className="block font-medium mb-1">Tipo:</label>
        <input
          type="text"
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Digite o tipo do item"
          required
        />
      </div>

      {/* Campo Preço */}
      <div>
        <label className="block font-medium mb-1">Preço (R$):</label>
        <input
          type="number"
          step="0.01"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded"
          placeholder="Digite o preço do item"
          required
        />
      </div>

      {/* Campo Descrição */}
      <div>
        <label className="block font-medium mb-1">Descrição:</label>
        <textarea
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="w-full p-2 border rounded resize-none"
          rows={3}
          placeholder="Digite uma descrição para o item"
          required
        />
      </div>

      {/* Campo Estoque */}
      <div>
        <label className="block font-medium mb-1">Estoque:</label>
        <input
          type="number"
          value={newItem.stock}
          onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
          placeholder="Digite a quantidade em estoque"
          required
        />
      </div>

      {/* Campo Imagem */}
      <div>
        <label className="block font-medium mb-1">Imagem:</label>
        <div className="space-y-2">
          {/* Link da Imagem */}
          <input
            type="text"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Cole o link da imagem"
          />
          {/* Upload de Arquivo */}
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setNewItem({ ...newItem, image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Botão de Envio */}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Adicionar Item
      </button>
    </form>
  );
};

export default AddItemForm;