import React from 'react';
import { ArrowLeftIcon } from './icons';

interface HowItWorksPageProps {
  onNavigateBack: () => void;
}

const categoryDetailsList = [
  {
    name: "🩺 Saúde e Bem-estar",
    subServices: [
      "Consultas médicas (clínico geral, especialidades)",
      "Psicologia e terapia",
      "Nutrição",
      "Fisioterapia",
      "Enfermagem domiciliar",
      "Acupuntura",
      "Massoterapia",
      "Reiki e terapias holísticas",
      "Personal trainer",
    ],
  },
  {
    name: "💇 Beleza e Estética",
    subServices: [
      "Cabeleireiro e barbeiro",
      "Manicure e pedicure",
      "Maquiagem profissional",
      "Depilação",
      "Design de sobrancelhas",
      "Estética facial e corporal",
      "Bronzeamento artificial",
      "Micropigmentação",
      "Extensão de cílios",
    ],
  },
  {
    name: "🏗️ Construção e Reformas",
    subServices: [
      "Pedreiro",
      "Pintor",
      "Encanador",
      "Eletricista",
      "Carpinteiro",
      "Gesseiro",
      "Vidraceiro",
      "Instalador de pisos e revestimentos",
      "Marido de aluguel",
    ],
  },
  {
    name: "🧹 Serviços Domésticos e Limpeza",
    subServices: [
      "Faxina residencial",
      "Limpeza pós-obra",
      "Limpeza de estofados",
      "Passadeira",
      "Cuidador de idosos",
      "Babá",
      "Diarista",
      "Jardinagem",
      "Dedetização",
    ],
  },
  {
    name: "💻 Tecnologia e Informática",
    subServices: [
      "Suporte técnico",
      "Montagem e manutenção de computadores",
      "Criação de sites",
      "Design gráfico",
      "Marketing digital",
      "Social media",
      "Edição de vídeo",
      "Desenvolvimento de software",
      "Consultoria em TI",
    ],
  },
  {
    name: "📚 Educação e Aulas",
    subServices: [
      "Aulas particulares (reforço escolar)",
      "Idiomas (inglês, espanhol etc.)",
      "Música (violão, teclado, canto etc.)",
      "Cursos online",
      "Treinamentos profissionais",
      "Aulas de dança",
      "Preparatório para concursos/vestibulares",
    ],
  },
  {
    name: "🧾 Serviços Administrativos e Financeiros",
    subServices: [
      "Contabilidade e fiscal",
      "Consultoria empresarial",
      "Serviços de despachante",
      "Emissão de notas fiscais",
      "Regularização de documentos",
      "Declaração de imposto de renda",
      "Assessoria jurídica (advocacia)",
      "Coaching financeiro",
    ],
  },
  {
    name: "🚚 Transporte e Logística",
    subServices: [
      "Motoboy",
      "Frete e mudança",
      "Transporte executivo",
      "Entregas locais",
      "Motorista particular",
      "Aplicativos de transporte",
      "Guincho",
    ],
  },
  {
    name: "🐶 Serviços para Pets",
    subServices: [
      "Banho e tosa",
      "Dog walker",
      "Pet sitter (cuidador de animais)",
      "Adestramento",
      "Transporte pet",
      "Veterinário domiciliar",
    ],
  },
  {
    name: "📸 Eventos e Entretenimento",
    subServices: [
      "Fotografia e filmagem",
      "DJ e som para festas",
      "Cerimonialista",
      "Buffet e bartender",
      "Decoração de festas",
      "Locação de equipamentos",
      "Recreação infantil",
      "Animação de eventos",
    ],
  },
  {
    name: "🏡 Serviços Imobiliários",
    subServices: [
      "Corretor de imóveis",
      "Avaliação de imóveis",
      "Administração de aluguéis",
      "Paisagismo",
      "Decoração de interiores",
      "Mudança e transporte",
      "Reformas e manutenções",
    ],
  },
];


const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-slate-200">
      <button
        onClick={onNavigateBack}
        className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Voltar para a Página Inicial
      </button>

      <div className="bg-slate-800/70 backdrop-blur-md shadow-xl rounded-lg p-6 md:p-10 border border-slate-700">
        <h1 className="text-4xl font-extrabold text-sky-400 mb-8 text-center">
          Como Funciona o Troca<span className="text-white">Serviços</span>
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Bem-vindo à nossa plataforma de troca de serviços! Aqui, você pode conectar-se com outras pessoas para trocar habilidades e conhecimentos sem a necessidade de transações monetárias. Acreditamos no poder da comunidade e na valorização dos talentos de cada um.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-sky-300 mb-6 border-b-2 border-sky-500 pb-2">
            Passos para Trocar Serviços
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-slate-300 pl-4">
            <li>
              <strong className="text-white">Cadastre-se:</strong> Crie sua conta gratuitamente. É rápido e fácil!
            </li>
            <li>
              <strong className="text-white">Ofereça seu Serviço:</strong> No formulário de cadastro, descreva o serviço que você pode oferecer. Escolha uma categoria relevante para que outros possam encontrá-lo.
            </li>
            <li>
              <strong className="text-white">Explore os Serviços:</strong> Navegue pelos serviços disponíveis na plataforma. Utilize o filtro por categoria para refinar sua busca e encontrar exatamente o que precisa.
            </li>
            <li>
              <strong className="text-white">Manifeste Interesse:</strong> Encontrou um serviço interessante? Clique em "Manifestar Interesse" para iniciar uma conversa com o prestador.
            </li>
            <li>
              <strong className="text-white">Converse via Chat:</strong> Utilize nosso chat integrado para discutir os detalhes da troca, como horários, locais (se aplicável) e o que cada um espera da troca.
            </li>
            <li>
              <strong className="text-white">Realize a Troca:</strong> Após combinarem tudo, realizem a troca dos serviços. Aproveitem os benefícios mútuos e fortaleçam nossa comunidade!
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-sky-300 mb-6 border-b-2 border-sky-500 pb-2">
            Entendendo as Categorias de Serviço
          </h2>
          <p className="text-slate-300 mb-6">
            Para facilitar a busca e organização, os serviços são divididos nas seguintes categorias. Cada categoria engloba uma variedade de habilidades e especialidades:
          </p>
          <div className="space-y-8">
            {categoryDetailsList.map((category) => (
              <div key={category.name} className="p-6 bg-slate-700/50 rounded-lg border border-slate-600 shadow-md">
                <h3 className="text-xl font-bold text-teal-400 mb-3">{category.name}</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-4 text-sm">
                  {category.subServices.map((subService) => (
                    <li key={subService}>{subService}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

         <button
            onClick={onNavigateBack}
            className="mt-12 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-sky-500 text-base font-medium rounded-md text-sky-400 hover:bg-sky-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out mx-auto"
        >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
};

export default HowItWorksPage;