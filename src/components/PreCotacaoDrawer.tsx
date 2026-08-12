import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { ClipboardList, X, Plus, Minus, Trash2, ArrowRight, CheckCircle2, MessageSquare, AlertTriangle, AlertCircle } from 'lucide-react';

interface PreCotacaoDrawerProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSubmitQuote: (details: { buyerPhone: string; buyerName?: string; buyerCity?: string }) => void;
  onAddVib?: (countNeeded: number) => void;
}

export const PreCotacaoDrawer: React.FC<PreCotacaoDrawerProps> = ({
  cartItems,
  isOpen,
  onClose,
  onOpen,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitQuote,
  onAddVib
}) => {
  const [phone, setPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerCity, setBuyerCity] = useState('');
  const [showPhoneStep, setShowPhoneStep] = useState(false);
  const [ruleError, setRuleError] = useState<string | null>(null);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalNormalPrice = cartItems.reduce((acc, item) => acc + item.product.priceNormal * item.quantity, 0);
  const totalPromoPrice = cartItems.reduce((acc, item) => acc + item.product.pricePromo * item.quantity, 0);
  const totalSavings = totalNormalPrice - totalPromoPrice;

  // Cálculo da regra de vínculo promocional: 1 VIB para cada FIB/FIP
  const fibFipQuantity = cartItems.reduce((acc, item) => {
    const isFibFip =
      item.product.sku.toUpperCase().startsWith('FIB') ||
      item.product.sku.toUpperCase().startsWith('FIP') ||
      item.product.category === 'monocanal-fix';
    return isFibFip ? acc + item.quantity : acc;
  }, 0);

  const vibQuantity = cartItems.reduce((acc, item) => {
    const isVib =
      item.product.sku.toUpperCase().startsWith('VIB') ||
      item.product.category === 'monocanal-var';
    return isVib ? acc + item.quantity : acc;
  }, 0);

  const missingVib = Math.max(0, fibFipQuantity - vibQuantity);

  const handleProceedQuote = () => {
    if (cartItems.length === 0) return;

    // Valida a regra promocional obrigatória (1 VIB por FIB/FIP)
    if (fibFipQuantity > 0 && missingVib > 0) {
      setRuleError(
        `Para ter acesso a essa promoção, a cada micropipeta modelo FIB ou FIP comprada, é obrigatório comprar 1 VIB. Faltam ${missingVib} micropipeta(s) VIB no seu pedido.`
      );
      return;
    }

    setRuleError(null);

    if (!showPhoneStep) {
      setShowPhoneStep(true);
    } else {
      if (!phone) {
        alert('Por favor, informe seu número de WhatsApp para direcionarmos a cotação.');
        return;
      }
      onSubmitQuote({ buyerPhone: phone, buyerName, buyerCity });
      setShowPhoneStep(false);
      onClose();
    }
  };

  return (
    <>
      {/* BOTAO FLUTUANTE FIXO DE PRÉ-COTAÇÃO (Canto Inferior Direito) */}
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#00207E] via-[#002D96] to-[#0042B3] hover:from-[#00175B] hover:to-[#003494] text-white p-3.5 pr-5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-blue-400/30 transition-all transform hover:scale-105 active:scale-95 group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-white/25">
          <ClipboardList className="w-5 h-5 text-sky-200" />
        </div>
        <div className="text-left">
          <span className="block font-black text-xs leading-tight text-white">Pré-cotação</span>
          <span className="text-[10px] text-sky-200/90 font-semibold">
            {cartItems.length === 0 ? 'Nenhum item selecionado' : `${totalQuantity} ${totalQuantity === 1 ? 'item selecionado' : 'itens selecionados'}`}
          </span>
        </div>
        <div className="ml-2 w-6 h-6 rounded-full bg-white text-[#00207E] font-black text-xs flex items-center justify-center shadow-xs">
          {totalQuantity}
        </div>
      </button>

      {/* PAINEL LATERAL SLIDE-OVER (Print 5) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-200">
            
            {/* Header do Drawer - Print 5 */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-[#122A48]">
                  Monte sua pré-cotação
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Revise os produtos e quantidades. No próximo passo, informe apenas seu WhatsApp.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Produtos Adicionados ao Carrinho de Pré-cotação - Print 5 */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ClipboardList className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">Sua pré-cotação está vazia</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Navegue pelo catálogo e clique em "Adicionar" nas micropipetas e acessórios desejados.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemSavings = (item.product.priceNormal - item.product.pricePromo) * item.quantity;
                  return (
                    <div
                      key={item.product.id}
                      className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:border-sky-200 transition-all"
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-16 h-16 object-contain bg-slate-50 rounded-xl p-1 shrink-0"
                      />

                      <div className="flex-1 space-y-1 min-w-0">
                        <span className="bg-[#EBF3FA] text-[#21527A] font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {item.product.sku}
                        </span>
                        <h4 className="font-bold text-xs text-slate-800 truncate">
                          {item.product.name}
                        </h4>
                        
                        <div className="flex items-baseline space-x-1.5 text-xs">
                          <span className="text-slate-400 line-through text-[11px]">
                            R$ {(item.product.priceNormal * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="font-black text-[#122A48]">
                            R$ {(item.product.pricePromo * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="text-[10px] text-emerald-700 font-bold">
                          Economize R$ {itemSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Controles de Quantidade & Lixeira - Print 5 */}
                      <div className="flex flex-col items-end space-y-2 shrink-0">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-bold flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Indicador Discreto de Regra da Promoção (1 VIB para cada FIB/FIP) */}
              {cartItems.length > 0 && fibFipQuantity > 0 && (
                <div
                  className={`rounded-xl p-3 text-xs space-y-2 border transition-all ${
                    missingVib > 0
                      ? 'bg-sky-50/80 border-sky-200 text-sky-950'
                      : 'bg-sky-50 border-sky-300 text-sky-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {missingVib > 0 ? (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#21527A] shrink-0" />
                      )}
                      <span className="font-bold text-xs">
                        {missingVib > 0
                          ? `Promoção vinculada: adicione +${missingVib} VIB`
                          : 'Condição promocional preenchida com sucesso'}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shrink-0">
                      {vibQuantity}/{fibFipQuantity} VIBs
                    </span>
                  </div>

                  {missingVib > 0 && onAddVib && (
                    <button
                      onClick={() => onAddVib(missingVib)}
                      className="w-full bg-[#21527A] hover:bg-[#183E5E] text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Incluir +{missingVib} modelo VIB no pedido</span>
                    </button>
                  )}
                </div>
              )}

              {/* Mensagem de Orientaçao Discreta se faltar VIB */}
              {ruleError && (
                <div className="bg-sky-100/90 border border-sky-300 rounded-xl p-3 text-xs text-sky-950 font-medium flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <span>{ruleError}</span>
                </div>
              )}

              {/* Card de Economia Total Verde */}
              {cartItems.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Economia total</span>
                  </div>
                  <span className="text-sm font-black text-emerald-800">
                    R$ {totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            {/* Resumo da Seleção e Botão Final */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
                
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Quantidade total</span>
                    <span className="font-bold text-slate-900">{totalQuantity} {totalQuantity === 1 ? 'unidade' : 'unidades'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor de tabela</span>
                    <span className="font-bold line-through text-slate-400">
                      R$ {totalNormalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Total promocional</span>
                    <span className="font-black text-xl text-[#00207E]">
                      R$ {totalPromoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedQuote}
                  className="w-full bg-gradient-to-r from-[#00207E] via-[#002D96] to-[#0042B3] hover:from-[#00175B] hover:to-[#003494] active:scale-98 text-white font-black text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <span>Solicitar cotação</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* TELA EXCLUSIVA EM OVERLAY: Foco Total na Entrada do WhatsApp */}
      {isOpen && showPhoneStep && (
        <div className="fixed inset-0 z-50 bg-[#0B172E]/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 relative">
            
            {/* Ícone WhatsApp Destacado */}
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <MessageSquare className="w-8 h-8 fill-current" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#00207E] leading-tight">
                Informe seu WhatsApp para envio da cotação
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
                Sua lista com <strong className="text-slate-800">{totalQuantity} {totalQuantity === 1 ? 'item' : 'itens'}</strong> e valor promocional de <strong className="text-[#00207E]">R$ {totalPromoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> está pronta!
              </p>
            </div>

            {/* Inputs de Contato */}
            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Seu WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3.5 text-base sm:text-lg font-bold text-slate-800 bg-slate-50 rounded-xl border-2 border-slate-200 focus:border-[#25D366] focus:bg-white focus:ring-4 focus:ring-green-500/20 transition-all outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Nome / Razão Social (Opcional)
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Seu Nome ou Laboratório"
                  className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#00207E] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Botão de Envio WhatsApp */}
            <button
              onClick={handleProceedQuote}
              className="w-full bg-[#25D366] hover:bg-[#1ebc57] active:scale-98 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Enviar Cotação via WhatsApp</span>
            </button>

            {/* Botão de Cancelar / Voltar */}
            <button
              onClick={() => setShowPhoneStep(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline pt-1 block mx-auto"
            >
              ← Alterar produtos da lista
            </button>
          </div>
        </div>
      )}
    </>
  );
};
