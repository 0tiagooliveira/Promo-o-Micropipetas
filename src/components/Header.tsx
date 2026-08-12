import React from 'react';
import { Search, BarChart2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { IonlabLogo } from './IonlabLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  activeView: 'store' | 'admin';
  onToggleView: (view: 'store' | 'admin') => void;
  quotesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  activeView,
  onToggleView,
  quotesCount
}) => {
  const categories = [
    { id: 'all', label: 'Todas as Micropipetas' },
    { id: 'fib', label: 'Monocanal Volume Fixo (FIB)' },
    { id: 'fip', label: 'Série Premium Fixo (FIP)' },
    { id: 'vib', label: 'Monocanal Variável (VIB)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo Ionlab Oficial - Clique para Voltar ao Topo da Tela Inicial */}
        <a 
          href="#inicio" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onSelectCategory('all');
          }}
          className="shrink-0 flex items-center group py-0.5 cursor-pointer"
          title="Voltar ao topo da tela inicial"
        >
          <IonlabLogo variant="colored" height={68} className="transition-transform group-hover:scale-[1.03]" />
        </a>

        {/* Campo de Busca Estilo Pilula com Botão Lupa - Print 1 */}
        <div className="flex-1 max-w-2xl mx-2 flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Encontre o modelo, volume, micropipeta ou acessório da promoção"
              className="w-full pl-5 pr-12 py-2.5 text-xs sm:text-sm bg-[#F0F4F8] hover:bg-slate-100/90 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-[#00207E] focus:ring-2 focus:ring-[#00207E]/20 transition-all outline-none"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1.5 bottom-1.5 w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#00207E] hover:border-[#00207E] transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {activeView === 'admin' && (
            <button
              onClick={() => onToggleView('store')}
              className="shrink-0 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-xs"
            >
              Voltar para Loja
            </button>
          )}
        </div>
      </div>

      {/* Sub-Header Categorias em Pílulas com Gradiente Azul Elétrico */}
      <div className="bg-[#F8FAFC] border-t border-slate-200/60 py-2.5 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center space-x-2.5 min-w-max">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00207E] via-[#00309E] to-[#0042B3] text-white border-[#00207E] shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#00207E] hover:text-[#00207E] hover:bg-blue-50/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
