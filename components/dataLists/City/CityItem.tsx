"use client";
import React, { useState } from "react";
import axios from "axios";
import AddNeighborhoodsForm from "./AddNeighborhoodsForm";
import EditableNeighborhoods from "./EditableNeighborhoods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  City,
} from "../../../src/interfaces/interfaces"; // Importando os tipos


interface cityItemProps {
  fetchData: () => void;
  city: City;
  userId: string;
}
const cityItem = ({ fetchData, city, userId }: cityItemProps) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [editingcity, setEditingcity] = useState<string | null>(null);
  const [newcityName, setNewcityName] = useState<string>(""); 
  const handleEditcity = async () => {
    if (newcityName.trim() !== "") {
      const token = localStorage.getItem("token") || "";
      try {
        await api.put(
          `/api/cities/${userId}/${editingcity}`,
          { newName: newcityName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditingcity(null);
        setNewcityName(""); // Limpa o campo de input
        fetchData();
      } catch (error) {
        console.error("Erro ao atualizar cidade:", error);
      }
    }
  };
  const handleDeletecity = async () => {
    try {
      await api.delete(`/api/cities/${userId}/${city.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      console.error("Erro ao excluir cidade:", error);
    }
    fetchData();
  };
  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col justify-between space-x-2">
        {editingcity === city.name ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newcityName}
              onChange={(e) => setNewcityName(e.target.value)} // Atualiza o novo estado
              className="w-full p-2 border rounded"
              placeholder="Digite o novo nome da categoria"
              required
            />
            <FontAwesomeIcon
              icon={faSave}
              className="hover:text-blue-600 cursor-pointer h-6 w-6"
              onClick={handleEditcity}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="hover:text-red-600 cursor-pointer h-6 w-6"
              onClick={() => {
                setEditingcity(null);
                setNewcityName(""); // Limpa o campo de input ao cancelar
              }}
            />
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
            >
              <span>{city.name}</span>
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
                setEditingcity(city.name);
                setNewcityName(city.name);
              }}
            />
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full p-4 bg-gray-200 text-black font-bold rounded-lg flex justify-between items-center"
            >
              <span>{city.name}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-transform duration-300 ${openDropdown ? "transform rotate-180" : ""}`}
              />
            </button>

            <FontAwesomeIcon
              icon={faTrash}
              className="hover:text-red-600 cursor-pointer h-6 w-6"
              onClick={handleDeletecity}
            />
          </div>
        )}
      </div>
      {openDropdown && (
        <div className="space-y-4 p-4">
          <AddNeighborhoodsForm
            userId={userId}
            city={city}
            fetchData={fetchData}
             />
          <ul className="space-y-4">
            {city.neighborhoods.length > 0 ? (
              city.neighborhoods.map((item, index) => (
                <div
                  className="p-4 border rounded-lg shadow-md hover:bg-yellow-400 sm:p-6"
                  key={index}
                >
                  <EditableNeighborhoods
                    neighborhoods={item}
                    city={city}
                    fetchData={fetchData}
                    userId={userId}
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

export default cityItem;