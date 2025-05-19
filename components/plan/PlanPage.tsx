// pages/index.js
import Head from 'next/head';
import PlanCard from './PlanCard';

export default function Plan() {
  const plans = [
    {
      title: 'Plano Básico',
      price: 149,
      features: [
        { count: '1', label: 'Chatbot com menus interativos' },
        { count: 'Ilimitado', label: 'Conversas e atendimento automatizado' },
        { count: '50', label: 'Clientes Simultaneos' },
        { count: 'Personalizável', label: 'Sistema personalizável' },
      ],
      buttonLabel: 'Escolher Plano',
      className: 'bg-green-500 text-white',
    },
    {
      title: 'Plano Corporativo',
      price: 490,
      features: [
        { count: '5', label: 'Chatbots com menus interativos' },
        { count: 'Ilimitado', label: 'Conversas e atendimento automatizado' },
        { count: '100', label: 'Clientes Simultaneos' },
        { count: 'Personalizável', label: 'Sistema personalizável' },
      ],
      buttonLabel: 'Escolher Plano',
      className: 'bg-orange-500 text-white',
    },
    {
      title: 'Plano IA Premium',
      price: 599,
      features: [
        { count: '1', label: 'Chatbot com IA avançada' },
        { count: 'Ilimitado', label: 'Conversas e atendimento automatizado' },
        { count: '50', label: 'Clientes Simultaneos' },
        { count: 'Personalizável', label: 'Sistema personalizável' },
      ],
      buttonLabel: 'Escolher Plano',
      className: 'bg-yellow-500 text-white',
    },
    {
      title: 'Plano Médio',
      price: 2999,
      features: [
        { count: '5', label: 'Chatbots com menus interativos' },
        { count: 'Ilimitado', label: 'Conversas e atendimento automatizado' },
        { count: '50', label: 'Clientes Simultaneos' },
        { count: 'Personalizável', label: 'Sistema personalizável' },
      ],
      buttonLabel: 'Escolher Plano',
      className: 'bg-purple-500 text-white',
    },
  ];

  return (
    <>
      <Head>
        <title>Planos de Serviços | Empresa XYZ</title>
      </Head>

      <main className="max-w-6xl mx-auto p-6">
        {/* Título da Seção */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-center mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-center text-gray-600">
            Encontre o plano que melhor se adapta às suas necessidades.
          </p>
        </section>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              buttonLabel={plan.buttonLabel}
              className={plan.className}
            />
          ))}
        </div>
      </main>
    </>
  );
}