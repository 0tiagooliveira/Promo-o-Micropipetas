import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ArrowLeft, Clock, ShieldCheck, Truck, ShoppingCart, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitQuote: (data: {
    buyerName?: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerCity?: string;
    buyerState?: string;
    quantity: number;
    notes?: string;
  }) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSubmitQuote,
  onAddToCart
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Reset e Carrossel Automático de Fotos do Modal
  useEffect(() => {
    setSelectedImageIndex(0);
    if (!product || !product.images || product.images.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [product]);

  if (!product) return null;

  const savings = product.priceNormal - product.pricePromo;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      onClose();
    } else {
      onSubmitQuote({
        buyerPhone: '(11) 98888-7777',
        quantity
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Container - Print 4 */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Modal - Print 4 */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#00207E] hover:text-[#00175B] flex items-center space-x-1 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para os produtos</span>
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo em Duas Colunas - Print 4 */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Coluna Esquerda: Galeria de Fotos e Zoom - Print 4 */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Foto Principal com Badge "Passe o mouse para ampliar" */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center min-h-[320px] shadow-2xs group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="max-h-72 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
              
              <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                Passe o mouse para ampliar
              </div>
            </div>

            {/* Thumbnails de Múltiplas Fotos */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white shrink-0 overflow-hidden transition-all ${
                      selectedImageIndex === idx ? 'border-[#21527A] ring-2 ring-[#21527A]/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Especificações Técnicas em Tabela Limpa */}
            {product.specs && product.specs.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Especificações Técnicas
                </h4>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-200/50 last:border-0 pb-1">
                      <span className="text-slate-500 font-medium">{spec.label}:</span>
                      <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Coluna Direita: Detalhes, Preços, Garantia e Ações - Print 4 */}
          <div className="md:col-span-6 space-y-5">
            
            {/* SKU Badge & Categoria */}
            <div className="flex items-center space-x-2">
              <span className="bg-blue-50 text-[#00207E] font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200">
                {product.sku}
              </span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                {product.categoryLabel}
              </span>
            </div>

            {/* Título Principal */}
            <h2 className="text-xl sm:text-2xl font-black text-[#122A48] leading-tight">
              {product.name}
            </h2>

            {/* Card Informativo Azul Claro - Print 4 */}
            <div className="bg-[#F0F4F8] rounded-2xl p-4 border border-sky-100/80 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#122A48]">Desconto direto para revenda</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Condição pensada para facilitar a negociação e acelerar o fechamento no seu laboratório.
                </p>
              </div>
              <span className="text-xs font-bold text-[#21527A] underline shrink-0 cursor-pointer hover:text-sky-900 ml-2">
                Ver linha
              </span>
            </div>

            {/* Bloco de Preços */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-slate-500 font-bold uppercase">DE</span>
                <span className="text-base sm:text-lg font-extrabold text-red-600 line-through decoration-2 decoration-red-600">
                  R$ {product.priceNormal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-xs font-bold text-emerald-800">POR</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 leading-none tracking-tight">
                  R$ {product.pricePromo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Tag Verde de Economia - Print 4 */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="inline-block bg-emerald-100/90 text-emerald-900 text-xs font-black px-3 py-1.5 rounded-lg border border-emerald-300 shadow-xs">
                  🏷️ Economia de R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (-{product.discountPercent}%)
                </div>

                {(product.sku.toUpperCase().startsWith('FIB') || product.sku.toUpperCase().startsWith('FIP') || product.category === 'monocanal-fix') && (
                  <div className="inline-block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-950 text-xs font-black px-3 py-1.5 rounded-lg border-2 border-amber-400 shadow-sm animate-pulse">
                    💡 Promoção válida com 1 VIB
                  </div>
                )}

                {(product.sku.toUpperCase().startsWith('VIB') || product.category === 'monocanal-var') && (
                  <div className="inline-block bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-300">
                    ⭐ Valida 1 modelo FIB/FIP na promoção
                  </div>
                )}
              </div>
            </div>

            {/* Caixinha do Cronômetro do Modal - Print 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3 text-xs text-slate-700">
              <Clock className="w-5 h-5 text-[#21527A] shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Esta condição encerra em 31/08.</span>
                <span className="text-slate-500 text-[11px]">Faltam 21d 12h para o encerramento da promoção.</span>
              </div>
            </div>

            {/* 3 Blocs Proposta de Valor - Print 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <h5 className="font-bold text-[11px] text-slate-900 leading-tight">Mais margem na revenda</h5>
                <p className="text-[10px] text-slate-500 mt-1">
                  Desconto de fábrica para criar uma proposta competitiva.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <h5 className="font-bold text-[11px] text-slate-900 leading-tight">Itens a pronta entrega</h5>
                <p className="text-[10px] text-slate-500 mt-1">
                  Estoque imediato para envio rápido em todo o Brasil.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <h5 className="font-bold text-[11px] text-slate-900 leading-tight">Cotação sem complicação</h5>
                <p className="text-[10px] text-slate-500 mt-1">
                  Envie o pedido direto pelo WhatsApp ao consultor da sua região.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Rodapé Fixo do Modal com Botão "Adicionar à Cotação" - Print 4 */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-600">Qtd:</span>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-white border border-slate-300 font-bold text-xs rounded-lg px-2 py-1.5 outline-none"
            >
              {[1, 2, 3, 4, 5, 10, 20].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'unidade' : 'unidades'}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-[#00207E] via-[#002D96] to-[#0042B3] hover:from-[#00175B] hover:to-[#003494] active:scale-98 text-white font-black text-sm py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Adicionar à cotação</span>
          </button>

        </div>

      </div>

    </div>
  );
};
