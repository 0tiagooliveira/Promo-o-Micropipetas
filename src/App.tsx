import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { PreCotacaoDrawer } from './components/PreCotacaoDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { VideoPopupModal } from './components/VideoPopupModal';
import { Product, CartItem } from './types';
import { fetchProducts, sendTrackingEvent, submitQuoteRequest } from './services/api';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [quotesCount, setQuotesCount] = useState(0);

  // Estado do Carrinho de Pré-cotação (Print 5)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Rolagem automática para o topo ao alternar de tela (ex: abrir Admin)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  // Carrega produtos da API / Local e envia evento inicial de visita com UTMs
  useEffect(() => {
    async function init() {
      const data = await fetchProducts();
      setProducts(data);

      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || undefined;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const device = isMobile ? 'Mobile' : 'Desktop';

      sendTrackingEvent({
        eventType: 'visit',
        device,
        utmSource,
        utmCampaign
      });
    }

    init();
  }, []);

  const handleOpenModal = (product: Product) => {
    setActiveModalProduct(product);
    sendTrackingEvent({
      eventType: 'modal_open',
      sku: product.sku,
      productName: product.name,
      device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    });
  };

  const handleCloseModal = () => {
    setActiveModalProduct(null);
  };

  // Adicionar item ao carrinho de pré-cotação
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    setIsDrawerOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Adicionar VIB automaticamente para cumprir a regra da promoção
  const handleAddVibNeeded = (countNeeded: number) => {
    const vibProd = products.find(
      (p) => p.sku.toUpperCase().startsWith('VIB') || p.category === 'monocanal-var'
    );
    if (vibProd) {
      handleAddToCart(vibProd, countNeeded);
    }
  };

  // Enviar cotação de 1 único item ou do carrinho completo
  const handleRequestQuote = async (
    product: Product,
    quantity: number = 1,
    buyerDetails?: {
      buyerName?: string;
      buyerPhone?: string;
      buyerEmail?: string;
      buyerCity?: string;
      buyerState?: string;
      notes?: string;
    }
  ) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const result = await submitQuoteRequest({
      buyerName: buyerDetails?.buyerName || 'Cliente Ionlab',
      buyerPhone: buyerDetails?.buyerPhone || '(11) 98888-7777',
      buyerEmail: buyerDetails?.buyerEmail,
      buyerCity: buyerDetails?.buyerCity,
      buyerState: buyerDetails?.buyerState,
      items: [
        {
          sku: product.sku,
          name: product.name,
          quantity,
          unitPrice: product.pricePromo,
          totalPrice: product.pricePromo * quantity
        }
      ],
      deviceType: isMobile ? 'Mobile' : 'Desktop'
    });

    setQuotesCount((prev) => prev + 1);
    window.open(result.whatsappUrl, '_blank');

    if (activeModalProduct) {
      setActiveModalProduct(null);
    }
  };

  // Enviar cotação de múltiplos itens do carrinho de pré-cotação
  const handleSubmitCartQuote = async (details: {
    buyerPhone: string;
    buyerName?: string;
    buyerCity?: string;
  }) => {
    if (cartItems.length === 0) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const formattedItems = cartItems.map((item) => ({
      sku: item.product.sku,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.pricePromo,
      totalPrice: item.product.pricePromo * item.quantity
    }));

    const result = await submitQuoteRequest({
      buyerName: details.buyerName || 'Cliente Ionlab',
      buyerPhone: details.buyerPhone,
      buyerCity: details.buyerCity,
      items: formattedItems,
      deviceType: isMobile ? 'Mobile' : 'Desktop'
    });

    setQuotesCount((prev) => prev + 1);
    setCartItems([]);
    window.open(result.whatsappUrl, '_blank');
  };

  const handleModalSubmitQuote = (data: {
    buyerName?: string;
    buyerPhone: string;
    buyerEmail?: string;
    buyerCity?: string;
    buyerState?: string;
    quantity: number;
    notes?: string;
  }) => {
    if (!activeModalProduct) return;
    handleRequestQuote(activeModalProduct, data.quantity, data);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#00207E] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      
      {/* Header Fixo - Print 1 */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeView={activeView}
        onToggleView={setActiveView}
        quotesCount={quotesCount}
      />

      {/* Alternância entre Loja Promocional e Painel Admin */}
      {activeView === 'store' ? (
        <main className="flex-1">
          {/* Hero Banner com Gatilho de Urgência, Cronômetro e Espaço de Carrossel */}
          <HeroBanner
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Grid de Produtos com Filtros, Subcategorias e Ancoragem De/Por */}
          <ProductGrid
            products={products}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenModal={handleOpenModal}
            onRequestQuote={(p, q) => handleRequestQuote(p, q)}
            onAddToCart={handleAddToCart}
          />

          {/* Modal de Detalhes do Produto - Print 4 */}
          <ProductModal
            product={activeModalProduct}
            onClose={handleCloseModal}
            onSubmitQuote={handleModalSubmitQuote}
            onAddToCart={handleAddToCart}
          />

          {/* Painel Flutuante e Lateral "Monte sua pré-cotação" - Print 5 */}
          <PreCotacaoDrawer
            cartItems={cartItems}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpen={() => setIsDrawerOpen(true)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitQuote={handleSubmitCartQuote}
            onAddVib={handleAddVibNeeded}
          />
        </main>
      ) : (
        /* Painel Administrativo de Tracking em Tempo Real - Prints 6 a 10 */
        <main className="flex-1">
          <AdminDashboard onBackToStore={() => setActiveView('store')} />
        </main>
      )}

      {/* Rodapé Oficial Ionlab com Selos de Garantia e Link do Painel */}
      <Footer onToggleView={setActiveView} />

      {/* Popup Automático do Vídeo de Apresentação */}
      <VideoPopupModal />
    </div>
  );
}
