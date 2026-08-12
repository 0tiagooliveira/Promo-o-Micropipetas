import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenModal: (product: Product) => void;
  onRequestQuote: (product: Product, quantity: number) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onOpenModal,
  onRequestQuote,
  onAddToCart
}) => {
  const [sortBy, setSortBy] = useState<'promo' | 'discount' | 'sku'>('promo');

  // Filtro de Busca
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.sku.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.volumeRange.toLowerCase().includes(query);

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'promo') return a.pricePromo - b.pricePromo;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'sku') return a.sku.localeCompare(b.sku);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Agrupamento por Subcategoria para o Catálogo Completo (Print 3)
  const categoryGroups = useMemo(() => {
    const groups: { [key: string]: { label: string; items: Product[] } } = {
      'fib': { label: 'Monocanal Volume Fixo — Linha FIB', items: [] },
      'fip': { label: 'Série Premium Volume Fixo — Linha FIP', items: [] },
      'vib': { label: 'Monocanal Volume Variável — Linha VIB', items: [] },
    };

    filteredProducts.forEach((p) => {
      if (groups[p.category]) {
        groups[p.category].items.push(p);
      } else {
        groups[p.category] = { label: p.categoryLabel, items: [p] };
      }
    });

    return Object.entries(groups).filter(([_, group]) => group.items.length > 0);
  }, [filteredProducts]);

  return (
    <section id="produtos" className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-12">
      
      {/* CATÁLOGO COMPLETO POR SUBCATEGORIA */}
      <div className="space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00207E]"></span>
              <span>Catálogo completo por subcategoria</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Selecione o Modelo Ideal para seu Laboratório
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Os produtos abaixo estão organizados por subcategoria para facilitar a leitura da promoção e a escolha do modelo ideal para sua revenda ou uso direto.
            </p>
          </div>

          {/* Filtros e Ordenação */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="promo">Menor Preço Promocional</option>
                <option value="discount">Maior Desconto (%)</option>
                <option value="sku">SKU (Referência)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exibição por Grupos de Subcategoria (Print 3) */}
        {categoryGroups.length > 0 ? (
          categoryGroups.map(([catKey, group]) => (
            <div key={catKey} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-6 space-y-4">
              
              {/* Header do Bloco da Subcategoria com Tag de 'X ITENS' - Print 3 */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {group.label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modelos analíticos, peças de estudo e equipamentos com forte apelo de catálogo.
                  </p>
                </div>
                <span className="bg-slate-200/80 text-slate-700 font-extrabold text-xs px-3 py-1 rounded-lg border border-slate-300/60 shrink-0">
                  {group.items.length} ITENS
                </span>
              </div>

              {/* Grid 5 Colunas de Produtos (Print 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={onOpenModal}
                    onRequestQuote={onRequestQuote}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
            <p className="text-slate-600 font-bold">Nenhum produto encontrado.</p>
            <p className="text-xs text-slate-400 mt-1">Tente buscar por outro termo ou limpe os filtros.</p>
            <button
              onClick={() => onSelectCategory('all')}
              className="mt-4 px-4 py-2 bg-[#21527A] text-white font-bold text-xs rounded-xl"
            >
              Ver todos os produtos
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
