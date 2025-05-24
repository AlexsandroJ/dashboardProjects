// components/PlanCard.js
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

const PlanCard = ({ title, price, features, buttonLabel, className, link }) => {
  const router = useRouter();

  return (
    <div
      className={`shadow-lg rounded-lg p-6 flex flex-col justify-between min-w-[280px] max-w-full h-[450px] ${className}`}
    >
      {/* Título do Plano */}
      <h3 className="text-xl font-bold text-center mb-4">{title}</h3>

      {/* Preço */}
      {price ? (
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-3xl font-bold text-green-500">R$ {price}</span>
          <span className="text-sm text-gray-600">/mês</span>
        </div>
      ) : (
        <span className="bg-green-500 px-4 py-2 rounded text-sm uppercase font-bold text-center">
          Grátis
        </span>
      )}

      {/* Tabela de Recursos */}
      <div className="w-full overflow-y-auto flex-grow">
        <table className="min-w-full table-auto text-left text-sm">
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-gray-200 last:border-b-0">
                <td className="py-2 px-1 font-semibold text-gray-700 w-1/2">{feature.label}</td>
                <td className="py-2 px-1 text-gray-800 ">{feature.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão de Ação */}
      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold w-full mt-4"
        onClick={() => router.push(link)}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PlanCard;