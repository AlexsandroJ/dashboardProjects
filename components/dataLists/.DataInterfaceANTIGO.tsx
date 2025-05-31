"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCategoryForm from "./Category/AddCategoryForm";
import AddCityForm from "./City/AddCityForm";
import CategoryItem from "./Category/CategoryItem";
import CityItem from "./City/CityItem";
import HelpTooltip from "../HelpTooltip"; // ajuste o caminho se necessário
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string[] | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIBASEURL,
  });

  const fetchData = async () => {
    const email = "alex@example.com";
    const password = "password321";

    try {
      const sessionRes = await api.post(`/api/sessions/login`, {
        email,
        password,
      });
      const token = sessionRes.data.token;
      const userId = sessionRes.data.userId;

      const cityRes = await api.get<{ cities: City[] }>(
        `/api/cities/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await api.get<{ categories: Category[] }>(
        `/api/category/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = await api.get(`/api/users/${userId}`);
      const perfil = await api.get(`/api/profiles/${userId}`);

      setUserId(userId);
      // dados do perfil
      setName(user.data.name || null);
      setPhone(user.data.phone || []);
      setBio(perfil.data.bio || null);
      setAvatarUrl(perfil.data.avatarUrl || null);
      setAge(perfil.data.age || null);
      setLocation(perfil.data.location || null);

      localStorage.setItem("token", token);
      // dados do sistema
      setCategories(response.data.categories);
      setCities(cityRes.data.cities);
    } catch (err: any) {
      console.error(
        "Erro ao buscar Dados:",
        err.response?.data || err.message
      );
    }
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    router.push("/auth");
    // Limpa todos os dados do usuário
    setUserId(null);
    setName(null);
    setPhone([]);
    setBio(null);
    setAvatarUrl(null);
    setLocation(null);
    setAge(null);
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Dados do user */}
      <div>
        <h1>Name: {name}</h1>
        <h1>Idade: {age ?? 'Não informada'}</h1>

        <h2>Telefones:</h2>
        {Array.isArray(phone) && phone.length > 0 ? (
          phone.map((item, index) => (
            <div key={index} className="p-2">
              {item}
            </div>
          ))
        ) : (
          <p>Nenhum telefone cadastrado.</p>
        )}
        <h2>Bio: {bio || 'Nenhuma bio disponível.'}</h2>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-20 h-20 object-cover rounded-full mb-4"
          />
        )}
        <h2>Cidade: {location || 'Localização não informada'}</h2>
        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Sair
        </button>
      </div>

      {/* Seção Cidades e Bairros */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold  mb-2 flex items-center justify-center gap-2">
          Locais de Atendimento
          <HelpTooltip
            title="Gerenciar cidades e bairros"
            description="Adicione as cidades e bairros onde você realiza entregas ou oferece seus serviços."
            example={`1 👉 Recife \n2 👉 Jaboatão dos Guararapes\n3 👉 Olinda`}
          />
        </h2>

        <AddCityForm fetchCity={fetchData} userId={userId} />

        <div className="space-y-4 mt-4">
          {cities.map((city, index) => (
            <div key={index}>
              <CityItem
                key={index}
                city={city}
                fetchData={fetchData}
                userId={userId}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seção Produtos */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          Cadastro de Produtos
          <HelpTooltip
            title="Cadastro de produtos"
            description="Adicione novos produtos ao seu catálogo. Eles aparecerão em uma lista no chat do cliente."
            example={`
    1 👉​frango com catupiry
    👇
    R$ 25.99

    2 👉​pepperoni
    👇
    R$ 28.99

    3 👉​4 queijos
    👇
    R$ 30.99`}
          />
        </h2>

        <AddCategoryForm fetchCategories={fetchData} userId={userId} />
      </section>

      {/* Seção Categorias */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          Categorias de Produtos
          <HelpTooltip
            title="Organização por categorias"
            description="As categorias ajudam você a encontrar seus produtos mais facilmente.
            O sistema usa apenas um nivel de categorização. Categorizar produtos em apenas um nível de categorias traz simplicidade,
             agilidade na navegação e facilidade de gestão. 
             É ideal para negócios menores ou com catálogos menos complexos."
            example={`Pizzas Salgadas
    Pizza de Calabresa
    Pizza de Presunto e Queijo
Doces
    Pizza de Chocolate com Morango
    Pizza de Prestígio
Bebidas
    Coca-Cola 2L
    Guaraná Antarctica 2L
Sucos
    Suco de Laranja
    Suco de Limão
`}
          />
        </h2>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <CategoryItem
                key={index}
                category={category}
                fetchCategories={fetchData}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryList;