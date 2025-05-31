// AddCityForm.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface AddCityFormProps {
  fetchData: () => void;
  userId: string | null;
}
const AddCityForm = ({ fetchData, userId }: AddCityFormProps) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });
  const [newCity, setNewCity] = useState("");
  const handleAddCity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    try {
      await api.post(
        `/api/cities/${userId}`,
        { name: newCity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err: any) {
      console.error(
        `Erro ao Adcionar Cidade:${newCity}`,
        err.response?.data || err.message
      );
    }
    setNewCity("");
    fetchData();
  };
  return (
    <form onSubmit={handleAddCity} className="p-4 border rounded-lg shadow-md">
      <label className="block font-medium mb-2">
        Nome da Cidade:
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Digite o nome da nova Cidade"
          required
        />
      </label>
      <button type="submit">
        <FontAwesomeIcon icon={faPlus} className="hover:text-blue-600 cursor-pointer h-8 w-8" />
      </button>
    </form>
  );
};

export default AddCityForm;