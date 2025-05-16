// EditableItem.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  Item,
} from "../../../src/interfaces/interfaces"; // Importando os tipos


interface EditableItemProps {
  item: Item;
  category: string;
  fetchData: () => void;
  userId: string;
}

const EditableItem = ({ item, category, fetchData, userId }: EditableItemProps) => {

  //const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });

  const [editing, setEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleEditItem = async () => {
    await api.put(`/api/items/${userId}/${category}/${item.name}`, editedItem);
    setEditing(false);
    fetchData();
  };

  const handleDeleteItem = async () => {
    await api.delete(`/api/items/${userId}/${category}/${item.name}`);
    fetchData();
  };

  return editing ? (

    <form onSubmit={(e) => { e.preventDefault(); handleEditItem(); }}>
      <div className="p-4 border rounded-lg shadow-md sm:p-6"
      >
        <label className="flex items-center space-x-2 font-medium">
          <input
            type="checkbox"
            checked={editedItem.available}
            onChange={(e) => setEditedItem({ ...editedItem, available: e.target.checked })}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Disponível</span>
        </label>

        <strong>Nome:</strong>
        <input
          type="text"
          value={editedItem.name}
          onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          className="w-full p-2 border rounded"

        />
        <strong>Tipo:</strong>
        <input
          type="text"
          value={editedItem.type}
          onChange={(e) => setEditedItem({ ...editedItem, type: e.target.value })}
          className="w-full p-2 border rounded"

        />
        <strong>R$</strong>
        <input
          type="number"
          value={editedItem.price}
          onChange={(e) => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded"

        />
        <strong>Descrição</strong>
        <input
          type="text"
          value={editedItem.description}
          onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
          className="w-full p-2 border rounded"

        />
        <strong>Estoque</strong>
        <input
          type="number"
          value={editedItem.stock}
          onChange={(e) => setEditedItem({ ...editedItem, stock: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded"

        />
        <strong>Link</strong>
        <input
          type="text"
          value={editedItem.image}
          onChange={(e) => setEditedItem({ ...editedItem, image: e.target.value })}
          className="w-full p-2 border rounded"

        />

        {/* Repetir para outros campos */}
        <div className="flex flex-row justify-between space-y-2">
          <button type="submit">
            <FontAwesomeIcon icon={faSave} className="hover:text-blue-600 cursor-pointer h-8 w-8" />
          </button>
          <FontAwesomeIcon
            icon={faTimes}
            className="hover:text-red-600 cursor-pointer h-8 w-8"
            onClick={() => setEditing(false)}
          />
        </div>
      </div>
    </form>
  ) : (

    <div className="space-y-4">
      {/* Card de Item */}
      <div className="p-4 border rounded-lg shadow-md space-y-2">
        {/* Imagem e Informações Principais */}
        <div className="flex items-center space-x-4">
          {/* Imagem */}
          <img
            src={item.image}
            alt={`Imagem de ${item.name}`}
            className="w-20 h-20 object-cover rounded-md"
          />
          {/* Detalhes do Item */}
          <div className="flex flex-col justify-between space-y-1">
            <div className="font-bold text-lg">{item.name}</div>
            <div className="text-gray-600">
              <strong>Tipo:</strong> {item.type}
            </div>
            <div className="text-green-600 font-medium">
              <strong>R$</strong> {item.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="flex items-center space-x-2">
          <span className="font-medium">Disponível:</span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${item.available ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
          >
            {item.available ? "Sim" : "Não"}
          </span>
        </div>

        {/* Descrição */}
        <div className="text-gray-700">
          <strong>Descrição:</strong> {item.description}
        </div>

        {/* Estoque */}
        <div className="text-gray-700">
          <strong>Estoque:</strong> {item.stock} unidades
        </div>
      </div>
      <div className="flex flex-row justify-between space-y-2">
        <FontAwesomeIcon
          icon={faPen}
          className="hover:text-blue-600 cursor-pointer h-8 w-8"
          onClick={() => setEditing(true)}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="hover:text-red-600 cursor-pointer h-8 w-8"
          onClick={handleDeleteItem}
        />
      </div>
    </div>
  );
};

export default EditableItem;