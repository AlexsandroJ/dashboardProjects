"use client";
import React from "react";

import AddCategoryForm from "./Category/AddCategoryForm";
import AddCityForm from "./City/AddCityForm";
import CategoryItem from "./Category/CategoryItem";
import CityItem from "./City/CityItem";
import HelpTooltip from "../HelpTooltip"; 

import {
  City,
  Category,

} from "../../src/interfaces/interfaces"; // Importando os tipos

import { useUserContext } from "./UserContext.tsx";

const CategoryList = () => {
  const { categories, cities, userId, loading, fetchData } = useUserContext() as {
  categories: Category[];
  cities: City[];
  userId: string | null;
  loading: boolean;
  fetchData: () => void;
};
   if (loading) {
    return <div>Carregando...</div>;
  }
 // Se userId for null, não renderiza nada ou mostra um placeholder
  if (!userId) {
    return <div>Erro...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
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
        <AddCityForm fetchData={fetchData} userId={userId} />
        <div className="space-y-4 mt-4">
         <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          Bairros das Cidades
          <HelpTooltip
            title="Cadastro de Bairros"
            description="Adicione novos Bairros ao seu catálogo. Eles aparecerão em uma lista no chat do cliente após ele selecionar uma cidade."
            example={`1 👉 Cajueiro Seco \n2 👉 Piedade\n3 👉 Candeias`}
          />
        </h2>
          
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
        <AddCategoryForm fetchData={fetchData} userId={userId} />
      </section>
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
                userId={userId}
                fetchData={fetchData}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryList;