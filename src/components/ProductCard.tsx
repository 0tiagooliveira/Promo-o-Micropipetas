import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Minus, ShoppingCart, Play } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onRequestQuote: (product: Product, quantity: number) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  hasVideo?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onRequestQuote,
  onAddToCart,
  hasVideo = false
}) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      onRequestQuote(product, quantity);
    }
  };

  const savings = product.priceNormal - product.pricePromo;

  return (
    <div
      onClick={() => onOpenModal(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative p-3 sm:p-4"
    >
      {/* Topo: Badge de Vídeo (Se existir - Print 2) */}
      {hasVideo && (
        <div className="absolute top-3 left-3 z-10 bg-[#00207E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-xs">
          <Play className="w-2.5 h-2.5 fill-current text-white" />
          <span>Vídeo</span>
        </div>
      )}

      {/* Imagem do Produto com Destaque do Volume e Zoom Suave no Hover */}
      <div className="w-full h-44 sm:h-48 bg-[#F8FAFC] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-slate-100/80">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Pílulas do Carrossel de Fotos */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentImageIndex === idx
                    ? 'w-4 bg-[#00207E]'
                    : 'w-1.5 bg-slate-300/80 hover:bg-slate-400'
                }`}
                title={`Ver imagem ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* SKU Badge e Volume (Litragem) em Linha */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <span className="bg-blue-50/90 text-[#00207E] font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-blue-200/80 shrink-0">
          {product.sku}
        </span>
        <span className="text-xs font-bold text-[#00207E] bg-slate-100 px-2 py-0.5 rounded-md truncate" title={product.volumeRange}>
          {product.volumeRange}
        </span>
      </div>

      {/* Título do Produto */}
      <h3
        onClick={() => onOpenModal(product)}
        className="font-bold text-slate-800 text-xs sm:text-sm leading-snug line-clamp-2 h-9 mt-1.5 cursor-pointer hover:text-[#00207E] transition-colors"
      >
        {product.name}
      </h3>

      {/* Bloco de Preços Limpo e Moderno */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1">
        {/* Linha superior: Preço Anterior e % Desconto */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-normal text-xs line-through">
              De R$ {product.priceNormal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="bg-[#00207E]/10 text-[#00207E] text-[10px] font-extrabold px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            Economia R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Linha principal: Preço Promocional em Azul Elétrico Ionlab */}
        <div className="flex items-baseline space-x-1 pt-0.5">
          <span className="text-[#00207E] font-black text-2xl sm:text-2xl leading-none tracking-tight">
            R$ {product.pricePromo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Regra de Vínculo sutil */}
        {(product.sku.toUpperCase().startsWith('FIB') || product.sku.toUpperCase().startsWith('FIP') || product.category === 'monocanal-fix') && (
          <div className="pt-1 flex items-center space-x-1.5 text-[11px] font-medium text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            <span>Promoção válida com 1 VIB</span>
          </div>
        )}

        {(product.sku.toUpperCase().startsWith('VIB') || product.category === 'monocanal-var') && (
          <div className="pt-1 flex items-center space-x-1.5 text-[11px] font-medium text-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
            <span>Ativa a promoção nos modelos FIB/FIP</span>
          </div>
        )}
      </div>

      {/* Barra de Ação Inferior: Seletor (- 1 +) e Botão "Adicionar" com Gradiente Vibrant Blue */}
      <div className="pt-3 flex items-center space-x-2">
        {/* Controle de Quantidade (- 1 +) */}
        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shrink-0">
          <button
            onClick={decrementQty}
            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            title="Diminuir"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-7 text-center font-bold text-xs text-slate-800 select-none">
            {quantity}
          </span>
          <button
            onClick={incrementQty}
            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            title="Aumentar"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Botão Adicionar à Cotação - Gradiente Azul Vibrante igual aos Banners */}
        <button
          onClick={handleAdd}
          className="flex-1 bg-gradient-to-r from-[#00207E] via-[#002D96] to-[#0042B3] hover:from-[#00175B] hover:to-[#003494] active:scale-98 text-white font-extrabold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Adicionar</span>
        </button>
      </div>

    </div>
  );
};
