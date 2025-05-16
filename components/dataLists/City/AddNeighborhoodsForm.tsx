// AddneighborhoodsForm.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  City
} from "../../../src/interfaces/interfaces"; // Importando os tipos

interface AddneighborhoodsFormProps {
  fetchData: () => void;
  userId: string;
  city: City;
}

const AddneighborhoodsForm = ({ fetchData, userId, city,  }: AddneighborhoodsFormProps) => {
  //const userId = process.env.NEXT_PUBLIC_USERID;
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });
  const [newneighborhoods, setNewneighborhoods] = useState({
    name: "",
  });

  const handleAddneighborhoods = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(userId,city)
      const token = localStorage.getItem("token") || "";
      await api.post(
        `/api/cities/${userId}/${city.name}/neighborhoods`,
        { neighborhoodName: newneighborhoods.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Erro ao adicionar neighborhoods:", error);
    }
  };

  return (
    <form onSubmit={handleAddneighborhoods} className="p-4 border rounded-lg shadow-md space-y-4">
    
    {/* Campo Nome */}
    <div>
      <label className="block font-medium mb-1">Nome:</label>
      <input
        type="text"
        value={newneighborhoods.name}
        onChange={(e) => setNewneighborhoods({ ...newneighborhoods, name: e.target.value })}
        className="w-full p-2 border rounded"
        placeholder="Digite o nome do Bairro"
        required
      />
    </div>
    {/* Botão de Envio */}
    <button
      type="submit"
      className="w-full py-2 px-4 rounded hover:bg-blue-600 transition-colors"
    >
      <FontAwesomeIcon icon={faPlus} className="mr-2" /> Adicionar Bairro
    </button>
  </form>
  );
};

export default AddneighborhoodsForm;