// Editableneighborhoods.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  City,
  Neighborhood,
} from "../../../src/interfaces/interfaces"; // Importando os tipos

interface EditableNeighborhoodsProps {
  fetchData: () => void;
  userId: string;
  city: City;
  neighborhoods: Neighborhood;
}
const EditableNeighborhoods = ({ fetchData, userId, city, neighborhoods }: EditableNeighborhoodsProps) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL, // URL do backend
  });
  const [editing, setEditing] = useState(false);
  const [editedNeighborhoods, setEditedNeighborhoods] = useState(neighborhoods);
  const handleEditNeighborhoods = async () => {
     try {
      const token = localStorage.getItem("token") || "";
      await api.put(
        `/api/cities/${userId}/${city.name}/${neighborhoods.name}`,
        { newNeighborhoodName: editedNeighborhoods.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditing(false);
      fetchData();
    } catch (error) {
      console.error("Erro ao Deletar neighborhoods:", error);
    }
  };

  const handleDeleteNeighborhoods = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      await api.delete(
        `/api/cities/${userId}/${city.name}/${neighborhoods.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Erro ao Deletar neighborhoods:", error);
    }
  };

  return editing ? (

    <form onSubmit={(e) => { e.preventDefault(); handleEditNeighborhoods(); }}>
      <div className="p-4 border rounded-lg shadow-md sm:p-6"
      >
        <strong>Nome:</strong>
        <input
          type="text"
          value={editedNeighborhoods.name}
          onChange={(e) => setEditedNeighborhoods({ ...editedNeighborhoods, name: e.target.value })}
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
      {/* Card de neighborhoods */}

      {/* Imagem e Informações Principais */}
      <div className="flex neighborhoodss-center space-x-4">
        {/* Detalhes do neighborhoods */}
        <div className="flex flex-col justify-between space-y-1">
          <div className="font-bold text-lg">{neighborhoods.name}</div>
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
          onClick={handleDeleteNeighborhoods}
        />
      </div>
    </div>
  );
};

export default EditableNeighborhoods;