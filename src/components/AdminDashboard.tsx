import React, { useState, useEffect } from 'react';
import { IonlabLogo } from './IonlabLogo';
import {
  KPIMetrics,
  TrackingEvent,
  QuoteRequest,
  SellerRoutingRule,
  ProductPerformance,
  Product,
  BannerItem
} from '../types';
import {
  getKPIMetrics,
  getLiveTrackingEvents,
  getQuotesList,
  getIsTestMode,
  setTestMode,
  getSellerRules,
  getProductPerformance,
  fetchProducts,
  saveProduct,
  deleteProduct,
  getBanners,
  saveBannerItem,
  deleteBannerItem
} from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import {
  Users, ShoppingBag, TrendingUp, DollarSign, Activity, MapPin, Globe,
  Mail, Phone, RefreshCw, LayoutDashboard, FileText, Package, UserCheck,
  ToggleLeft, ToggleRight, ArrowUpRight, LogOut, Search, ExternalLink,
  Plus, Edit, Trash2, CheckCircle, AlertCircle, X, Image as ImageIcon
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [metrics, setMetrics] = useState<KPIMetrics>(getKPIMetrics());
  const [liveEvents, setLiveEvents] = useState<TrackingEvent[]>(getLiveTrackingEvents());
  const [quotes, setQuotes] = useState<QuoteRequest[]>(getQuotesList());
  const [isTestMode, setIsTestModeState] = useState<boolean>(getIsTestMode());
  const [sellerRules, setSellerRules] = useState<SellerRoutingRule[]>(getSellerRules());
  const [rankings, setRankings] = useState<ProductPerformance[]>(getProductPerformance());
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [bannersList, setBannersList] = useState<BannerItem[]>(getBanners());
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'products' | 'banners' | 'sellers'>('overview');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString('pt-BR'));

  // Estado para CRUD de Produtos
  const [productSearch, setProductSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [imageInputUrl, setImageInputUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado para CRUD de Banners
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Partial<BannerItem>>({});
  const [bannerHighlightInput, setBannerHighlightInput] = useState<string>('');

  const loadAllProducts = async () => {
    const data = await fetchProducts();
    setProductsList(data);
  };

  const loadAllBanners = () => {
    setBannersList(getBanners());
  };

  const refreshData = () => {
    setMetrics(getKPIMetrics());
    setLiveEvents(getLiveTrackingEvents());
    setQuotes(getQuotesList());
    setRankings(getProductPerformance());
    loadAllProducts();
    loadAllBanners();
    setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTestMode = () => {
    const next = !isTestMode;
    setIsTestModeState(next);
    setTestMode(next);
    refreshData();
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct({
      id: '',
      sku: '',
      name: '',
      category: 'monocanal-var',
      categoryLabel: 'Monocanal Variável',
      priceNormal: 120.00,
      pricePromo: 79.90,
      discountPercent: 33,
      volumeRange: '0,5 - 10 µL',
      autoclavable: true,
      inStock: true,
      descriptionShort: 'Micropipeta com exatidão máxima, certificado e 2 anos de garantia.',
      images: []
    });
    setImageInputUrl('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setImageInputUrl('');
    setIsProductModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (!imageInputUrl.trim()) return;
    const currentImgs = editingProduct.images || [];
    setEditingProduct({
      ...editingProduct,
      images: [...currentImgs, imageInputUrl.trim()]
    });
    setImageInputUrl('');
  };

  const handleRemoveImageUrl = (index: number) => {
    const currentImgs = editingProduct.images || [];
    setEditingProduct({
      ...editingProduct,
      images: currentImgs.filter((_, i) => i !== index)
    });
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.sku || !editingProduct.name) {
      alert('Por favor, informe ao menos o SKU (Referência) e a Descrição do Produto.');
      return;
    }

    const saved = await saveProduct(editingProduct);
    await loadAllProducts();
    setIsProductModalOpen(false);
    showNotification(`Produto ${saved.sku} salvo com sucesso!`);
  };

  const handleDeleteProductConfirm = async (productId: string, sku: string) => {
    if (confirm(`Tem certeza que deseja excluir a micropipeta/produto SKU: ${sku}?`)) {
      await deleteProduct(productId);
      await loadAllProducts();
      showNotification(`Produto ${sku} excluído com sucesso.`);
    }
  };

  // Handlers para CRUD de Banners
  const handleOpenCreateBannerModal = () => {
    setEditingBanner({
      id: '',
      tag: 'TECNOLOGIA DE ALTA PRECISÃO',
      title: 'MICROPIPETAS DE ALTA PRECISÃO',
      subtitle: 'Desenvolvidas para máxima exatidão analítica, com ejetor de ponteiras ergonômico, isolamento térmico e suporte a autoclavagem.',
      discount: 'PREMIUM',
      categoryKey: 'all',
      productImage: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/5de3d244-f240-0376-6c4a-4d7fa4ef7da4.png',
      productName: 'Micropipeta Série Premium FIP',
      highlights: ['Autoclavável a 121°C', 'Aferição ISO 8655', 'Ejetor Ergonômico'],
      active: true
    });
    setBannerHighlightInput('');
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (banner: BannerItem) => {
    setEditingBanner({ ...banner });
    setBannerHighlightInput('');
    setIsBannerModalOpen(true);
  };

  const handleAddBannerHighlight = () => {
    if (!bannerHighlightInput.trim()) return;
    const currentHighlights = editingBanner.highlights || [];
    setEditingBanner({
      ...editingBanner,
      highlights: [...currentHighlights, bannerHighlightInput.trim()]
    });
    setBannerHighlightInput('');
  };

  const handleRemoveBannerHighlight = (idx: number) => {
    const currentHighlights = editingBanner.highlights || [];
    setEditingBanner({
      ...editingBanner,
      highlights: currentHighlights.filter((_, i) => i !== idx)
    });
  };

  const handleSaveBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner.title || !editingBanner.subtitle) {
      alert('Preencha ao menos o Título e o Subtítulo do Banner.');
      return;
    }
    const updated = saveBannerItem(editingBanner);
    setBannersList(updated);
    setIsBannerModalOpen(false);
    showNotification(`Banner "${editingBanner.title}" salvo com sucesso!`);
  };

  const handleDeleteBannerConfirm = (bannerId: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir o banner "${title}"?`)) {
      const updated = deleteBannerItem(bannerId);
      setBannersList(updated);
      showNotification(`Banner excluído com sucesso.`);
    }
  };

  const handleToggleBannerActive = (banner: BannerItem) => {
    const updated = saveBannerItem({ ...banner, active: !banner.active });
    setBannersList(updated);
    showNotification(`Banner ${!banner.active ? 'ativado' : 'desativado'}.`);
  };

  // Filtro de produtos
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.descriptionShort && p.descriptionShort.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Cálculos dinâmicos a partir de eventos e cotações reais
  const activeInLast5Min = liveEvents.filter(evt => (Date.now() - new Date(evt.timestamp).getTime()) < 5 * 60 * 1000).length;
  const revisitsCount = liveEvents.filter(evt => evt.eventType === 'visit').length;

  const sourceMap: Record<string, number> = {};
  liveEvents.forEach(e => {
    const source = e.utmSource ? e.utmSource : 'Acesso Direto / Orgânico';
    sourceMap[source] = (sourceMap[source] || 0) + 1;
  });
  const totalEventCount = liveEvents.length;
  const trafficSources = Object.entries(sourceMap).map(([name, count]) => ({
    name,
    count,
    percent: totalEventCount > 0 ? `${Math.round((count / totalEventCount) * 100)}%` : '0%'
  }));

  const regionMap: Record<string, number> = {};
  liveEvents.forEach(e => {
    const reg = e.state ? `Estado ${e.state}` : (e.city ? e.city : 'Não identificado');
    regionMap[reg] = (regionMap[reg] || 0) + 1;
  });
  quotes.forEach(q => {
    const reg = q.buyerState ? `Estado ${q.buyerState}` : 'Não identificado';
    regionMap[reg] = (regionMap[reg] || 0) + 1;
  });
  const totalRegionCount = Object.values(regionMap).reduce((a, b) => a + b, 0);
  const regionSources = Object.entries(regionMap).map(([region, count]) => ({
    region,
    count,
    percent: totalRegionCount > 0 ? `${Math.round((count / totalRegionCount) * 100)}%` : '0%'
  }));

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col md:flex-row text-slate-800">
      
      {/* SIDEBAR NAVEGAÇÃO ESCURA (#00207E) */}
      <aside className="w-full md:w-64 bg-[#00207E] text-white flex flex-col justify-between p-5 shrink-0 border-r border-blue-900/50 shadow-xl">
        
        <div className="space-y-6">
          {/* Logo Branca Ionlab Vetorial com Clique para Voltar à Loja */}
          <div className="pt-2 pb-4 border-b border-blue-400/20">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                if (onBackToStore) onBackToStore();
              }}
              className="block cursor-pointer hover:opacity-90 transition-opacity"
              title="Clique para voltar para a loja"
            >
              <IonlabLogo variant="white" height={38} />
            </a>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-sky-200/80 font-semibold">
                Painel em Tempo Real
              </p>
              {onBackToStore && (
                <button
                  onClick={onBackToStore}
                  className="text-[10px] text-sky-200 hover:text-white font-bold underline transition-colors"
                >
                  Voltar à loja
                </button>
              )}
            </div>
          </div>

          {/* Menu Principal da Sidebar */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-sky-600/30 text-white border border-sky-400/30'
                  : 'text-sky-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-300" />
              <span>Visão geral</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quotes'
                  ? 'bg-sky-600/30 text-white border border-sky-400/30'
                  : 'text-sky-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Cotações</span>
              <span className="ml-auto bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                {quotes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-sky-600/30 text-white border border-sky-400/30'
                  : 'text-sky-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Produtos</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'banners'
                  ? 'bg-sky-600/30 text-white border border-sky-400/30'
                  : 'text-sky-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Banners da Loja</span>
              <span className="ml-auto bg-cyan-500/80 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                {bannersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sellers')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sellers'
                  ? 'bg-sky-600/30 text-white border border-sky-400/30'
                  : 'text-sky-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Vendedores</span>
            </button>
          </nav>
        </div>

        {/* Rodapé Sidebar */}
        <div className="pt-6 border-t border-sky-900/60 text-[10px] text-sky-200/60 space-y-2">
          <p className="font-semibold">Painel Interno Ionlab</p>
          <p>Dados de tracking protegidos por sessão segura na VPS.</p>
        </div>

      </aside>

      {/* ÁREA PRINCIPAL CONTEÚDO PAINEL - Prints 6 a 10 */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* Top Header Barra Superior - Print 6 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center space-x-1.5">
              <span>Atualizado às {lastUpdated}</span>
              <button
                onClick={refreshData}
                className="text-[#21527A] hover:underline flex items-center space-x-1 font-bold ml-2"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Atualizar</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#122A48] tracking-tight">
              Desempenho da campanha
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <select className="bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl px-3 py-2 text-slate-700 outline-none">
              <option>Últimos 30 dias</option>
              <option>Hoje</option>
              <option>Últimos 7 dias</option>
            </select>

            <button
              onClick={() => window.location.reload()}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Recarregar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: VISÃO GERAL (OVERVIEW) - Prints 6 e 7 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* GRID DE 6 KPIS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visitas</span>
                <span className="text-2xl font-black text-[#122A48] mt-1 block">{metrics.totalVisits}</span>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">Registradas em tempo real</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cotações</span>
                <span className="text-2xl font-black text-[#25D366] mt-1 block">{metrics.quotesSent}</span>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">Leads WhatsApp</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversão</span>
                <span className="text-2xl font-black text-[#122A48] mt-1 block">{metrics.conversionRate}%</span>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">Taxa de conversão</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valor potencial</span>
                <span className="text-lg font-black text-[#122A48] mt-1 block">
                  R$ {metrics.potentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Cotações ativas</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Revisitas</span>
                <span className="text-2xl font-black text-[#122A48] mt-1 block">{revisitsCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Sessões registradas</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Produtos abertos</span>
                <span className="text-2xl font-black text-[#122A48] mt-1 block">{metrics.modalsOpened}</span>
                <span className="text-[10px] text-sky-600 font-bold block mt-1">Aberturas de modais</span>
              </div>

            </div>

            {/* SEÇÃO "AGORA NO SITE" AO VIVO */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping mr-1"></span>
                    <span>AO VIVO</span>
                  </span>
                  <h3 className="font-black text-sm text-[#122A48]">Agora no site</h3>
                </div>
                <span className="text-xs text-slate-400">Atividade em tempo real</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500">Ativos nos últimos 5 min</span>
                  <span className="text-3xl font-black text-[#122A48] block mt-1">{activeInLast5Min}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500">Visitas registradas</span>
                  <span className="text-3xl font-black text-[#122A48] block mt-1">{metrics.totalVisits}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-500">Revisitas registradas</span>
                  <span className="text-3xl font-black text-[#122A48] block mt-1">{revisitsCount}</span>
                </div>
              </div>

              {/* Feed de Eventos Recentes */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700">Atividade recente</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {liveEvents.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-center text-xs text-slate-400">
                      Nenhum evento registrado no momento. A navegação dos usuários aparecerá aqui em tempo real.
                    </div>
                  ) : (
                    liveEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-[#21527A]" />
                          <span className="font-bold text-slate-800">
                            {evt.eventType === 'whatsapp_click' ? `Cotação WhatsApp (${evt.sku})` : `Abertura de Modal (${evt.sku || 'Produto'})`}
                          </span>
                          <span className="text-slate-400">• {evt.city || 'Brasil'}{evt.state && evt.state !== 'BR' ? `/${evt.state}` : ''}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(evt.timestamp).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* SEÇÃO ORIGEM DOS ACESSOS & DISPOSITIVOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-[#122A48]">Origem dos acessos</h3>
                <div className="space-y-2">
                  {trafficSources.length === 0 ? (
                    <p className="text-xs text-slate-400 p-2">Sem acessos registrados no período.</p>
                  ) : (
                    trafficSources.map((src, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                        <span className="font-bold text-slate-700">{src.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-[#122A48]">{src.count}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                            {src.percent}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                <h3 className="font-black text-sm text-[#122A48]">De onde vêm os visitantes (Regiões)</h3>
                <div className="space-y-2">
                  {regionSources.length === 0 ? (
                    <p className="text-xs text-slate-400 p-2">Sem regiões registradas no período.</p>
                  ) : (
                    regionSources.map((reg, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                        <span className="font-bold text-slate-700">{reg.region}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-[#122A48]">{reg.count}</span>
                          <span className="text-[10px] bg-[#EBF3FA] text-[#21527A] font-bold px-1.5 py-0.5 rounded">
                            {reg.percent}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: COTAÇÕES RECEBIDAS & MODO DE TESTE */}
        {(activeTab === 'overview' || activeTab === 'quotes') && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-lg text-[#122A48]">Cotações recebidas</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rastreamento completo dos contatos recebidos com direcionamento automático por DDD.
                </p>
              </div>

              {/* Caixa de Alternância Modo de Teste */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center space-x-3">
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block">Modo de Distribuição E-mail:</span>
                  <span className={isTestMode ? 'text-amber-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                    {isTestMode ? 'Somente Marketing (marketing.ionlab@gmail.com)' : 'Fluxo Normal (E-mails Vendedores)'}
                  </span>
                </div>
                <button
                  onClick={handleToggleTestMode}
                  className="px-3 py-1.5 bg-[#21527A] hover:bg-[#122A48] text-white font-bold text-xs rounded-xl transition-all"
                >
                  Alternar
                </button>
              </div>
            </div>

            {/* Tabela de Cotações */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ref / Data</th>
                    <th className="p-3">Contato WhatsApp</th>
                    <th className="p-3">Local (DDD)</th>
                    <th className="p-3">Itens da Cotação</th>
                    <th className="p-3">Total (R$)</th>
                    <th className="p-3">Vendedor Atribuído</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 text-xs font-medium">
                        Nenhuma cotação recebida até o momento. As cotações solicitadas via WhatsApp aparecerão aqui em tempo real.
                      </td>
                    </tr>
                  ) : (
                    quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#122A48]">
                          #{q.id}
                          <div className="text-[10px] text-slate-400 font-normal">
                            {new Date(q.timestamp).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{q.buyerName || 'Cliente Ionlab'}</div>
                          <div className="text-xs text-[#25D366] font-bold">{q.buyerPhone}</div>
                        </td>
                        <td className="p-3">
                          <div>{q.buyerCity || 'São Paulo'}/{q.buyerState || 'SP'}</div>
                          <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                            DDD ({q.ddd})
                          </span>
                        </td>
                        <td className="p-3">
                          {q.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] truncate max-w-xs">
                              • <strong>{item.quantity}x {item.sku}</strong> ({item.name.substring(0, 24)}...)
                            </div>
                          ))}
                        </td>
                        <td className="p-3 font-black text-[#122A48] text-sm">
                          R$ {q.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{q.assignedSeller.name}</div>
                          <div className="text-[10px] text-sky-700 font-medium">
                            {q.isTestMode ? 'marketing.ionlab@gmail.com' : q.assignedSeller.email}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md">
                            Enviado WhatsApp
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: GESTÃO DE PRODUTOS & RANKING (CRUD COMPLETO) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* BARRA DE AÇÕES E BUSCA DE PRODUTOS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-[#122A48] flex items-center space-x-2">
                  <Package className="w-5 h-5 text-[#21527A]" />
                  <span>Gerenciador do Catálogo de Micropipetas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cadastre novas micropipetas, altere preços de tabela e de promoção, ou atualize fotos do lote.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-[#21527A] hover:bg-[#122A48] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Produto</span>
                </button>
              </div>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por SKU, nome ou descrição..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#21527A]"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium">Categoria:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="all">Todas as Categorias ({productsList.length})</option>
                  <option value="monocanal-fix">Monocanal Volume Fixo (FIB / FIP)</option>
                  <option value="monocanal-var">Monocanal Volume Variável (VIB)</option>
                  <option value="multicanal">Multicanal</option>
                  <option value="suportes">Acessórios & Suportes</option>
                </select>
              </div>
            </div>

            {/* TOAST DE NOTIFICAÇÃO DE SUCESSO */}
            {toastMessage && (
              <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{toastMessage}</span>
                </div>
                <button onClick={() => setToastMessage(null)} className="opacity-80 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TABELA DE PRODUTOS PARA CRUD */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Exibindo <strong className="text-slate-900">{filteredProducts.length}</strong> de {productsList.length} produtos
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Foto</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Descrição / Nome</th>
                      <th className="p-3">Preço Tabela</th>
                      <th className="p-3">Preço Promo</th>
                      <th className="p-3">Desc %</th>
                      <th className="p-3">Volume</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const hasRealImg = p.images && p.images.length > 0 && p.images[0].startsWith('http');
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                              {hasRealImg ? (
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-0.5" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-[#21527A] font-mono">{p.sku}</td>
                          <td className="p-3 max-w-xs">
                            <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{p.descriptionShort}</div>
                          </td>
                          <td className="p-3 font-medium text-slate-400 line-through">
                            R$ {p.priceNormal.toFixed(2)}
                          </td>
                          <td className="p-3 font-black text-emerald-600 text-sm">
                            R$ {p.pricePromo.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded-full">
                              -{p.discountPercent}%
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-600">
                            {p.volumeRange}
                          </td>
                          <td className="p-3">
                            {p.inStock ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                                Em Estoque
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                                Esgotado
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 bg-slate-100 hover:bg-[#21527A] hover:text-white text-slate-700 rounded-lg transition-colors"
                              title="Editar Produto"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProductConfirm(p.id, p.sku)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 rounded-lg transition-colors"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABELA SECUNDÁRIA DE METRICAS DE INTERESSE DE PRODUTOS */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div>
                <h3 className="font-black text-base text-[#122A48]">Métricas de Interesse por SKU (Média de Cliques)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acompanhamento de conversão e acessos individuais por produto.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Nome do Produto</th>
                      <th className="p-3">Visualizações</th>
                      <th className="p-3">Aberturas de Modal</th>
                      <th className="p-3">Cotações Iniciadas</th>
                      <th className="p-3">Valor Potencial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rankings.map((p) => (
                      <tr key={p.sku} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#21527A] font-mono">{p.sku}</td>
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3 font-bold">{p.views}</td>
                        <td className="p-3 font-bold text-sky-700">{p.modalOpens}</td>
                        <td className="p-3 font-black text-[#25D366]">{p.quoteClicks}</td>
                        <td className="p-3 font-black text-[#122A48]">
                          R$ {p.potentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DISTRIBUIÇÃO VENDEDORES POR DDD - Print 10 */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="font-black text-lg text-[#122A48]">Distribuição por vendedor</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Equipe comercial Ionlab e DDDs de atendimento atribuídos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {sellerRules.map((rule) => (
                <div key={rule.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <span className="font-black text-sm text-slate-900">{rule.sellerName}</span>
                    <span className="text-[10px] bg-blue-100 text-[#00207E] font-extrabold px-2.5 py-0.5 rounded-full w-fit">
                      {rule.regionName}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#00207E]" />
                      <span className="font-bold text-slate-800">{rule.sellerEmail}</span>
                    </div>

                    {rule.sellerPhone && (
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-800">{rule.sellerPhone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                    <span className="text-[10px] text-slate-400 font-bold mr-1 w-full">DDDs Atribuídos:</span>
                    {rule.ddds.map((ddd) => (
                      <span key={ddd} className="bg-white border border-slate-200 text-[#00207E] font-mono text-[10px] px-2 py-0.5 rounded font-extrabold shadow-2xs">
                        ({ddd})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB BANNERS DA LOJA */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-[#122A48] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-600" />
                  <span>Banners Promocionais da Loja</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gerencie os slides do carrossel principal da página inicial. Adicione novos banners, altere títulos, imagens e destaques.
                </p>
              </div>

              <button
                onClick={handleOpenCreateBannerModal}
                className="bg-[#21527A] hover:bg-[#122A48] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bannersList.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`bg-white rounded-2xl border ${
                    banner.active !== false ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60 bg-slate-50'
                  } p-5 space-y-4 relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-sky-100 text-[#21527A] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                          Slide #{index + 1}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                          {banner.discount}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            banner.active !== false ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {banner.active !== false ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-slate-400 block tracking-wider uppercase">
                        {banner.tag}
                      </span>
                      <h4 className="font-black text-base text-[#122A48] leading-tight">
                        {banner.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleToggleBannerActive(banner)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                          banner.active !== false
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title={banner.active !== false ? 'Pausar/Desativar Banner' : 'Ativar Banner'}
                      >
                        {banner.active !== false ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleOpenEditBannerModal(banner)}
                        className="p-1.5 bg-slate-100 hover:bg-[#21527A] hover:text-white text-slate-700 rounded-lg transition-colors"
                        title="Editar Banner"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBannerConfirm(banner.id, banner.title)}
                        className="p-1.5 bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 rounded-lg transition-colors"
                        title="Excluir Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="sm:col-span-1 flex items-center justify-center bg-white p-2 rounded-lg border border-slate-200">
                      <img
                        src={banner.productImage}
                        alt={banner.productName}
                        className="max-h-24 object-contain"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2 flex flex-col justify-center">
                      <span className="text-xs font-bold text-[#122A48]">
                        {banner.productName}
                      </span>
                      <div className="space-y-1">
                        {banner.highlights?.map((h, i) => (
                          <div key={i} className="flex items-center space-x-1 text-[11px] text-slate-600">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE PRODUTO (CRUD) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#122A48]">
                  {editingProduct.id ? `Editar Produto: ${editingProduct.sku}` : 'Cadastrar Nova Micropipeta / Produto'}
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha os dados do produto, preços promocionais e insira o link de foto.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU (Referência) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: FIB-0050"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={editingProduct.category || 'monocanal-var'}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let label = 'Monocanal Variável';
                      if (cat === 'monocanal-fix') label = 'Monocanal Volume Fixo';
                      if (cat === 'multicanal') label = 'Multicanal';
                      if (cat === 'suportes') label = 'Acessórios & Suportes';
                      setEditingProduct({ ...editingProduct, category: cat as any, categoryLabel: label });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  >
                    <option value="monocanal-fix">Monocanal Volume Fixo (FIB / FIP)</option>
                    <option value="monocanal-var">Monocanal Volume Variável (VIB)</option>
                    <option value="multicanal">Multicanal 8/12 Canais</option>
                    <option value="suportes">Acessórios & Suportes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome / Descrição do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MICROPIPETA SEMI-AUTOCLAVÁVEL 5UL"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preço Normal (R$ Tabela)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="105.00"
                    value={editingProduct.priceNormal ?? ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const promo = editingProduct.pricePromo || 0;
                      let disc = editingProduct.discountPercent;
                      if (val > 0 && promo > 0 && val > promo) {
                        disc = Math.round(((val - promo) / val) * 100);
                      }
                      setEditingProduct({ ...editingProduct, priceNormal: val, discountPercent: disc });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preço Promo (R$ Desconto)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="69.76"
                    value={editingProduct.pricePromo ?? ''}
                    onChange={(e) => {
                      const promoVal = parseFloat(e.target.value) || 0;
                      const norm = editingProduct.priceNormal || 0;
                      let disc = editingProduct.discountPercent;
                      if (norm > 0 && promoVal > 0 && norm > promoVal) {
                        disc = Math.round(((norm - promoVal) / norm) * 100);
                      }
                      setEditingProduct({ ...editingProduct, pricePromo: promoVal, discountPercent: disc });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-emerald-600 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desconto Calculado (%)</label>
                  <input
                    type="number"
                    disabled
                    value={editingProduct.discountPercent ?? 0}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faixa de Volume</label>
                  <input
                    type="text"
                    placeholder="Ex: 5 µL (Fixo) ou 0,5 - 5,0 µL"
                    value={editingProduct.volumeRange || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, volumeRange: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-5">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-[#21527A]"
                    />
                    <span>Em Estoque</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.autoclavable ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, autoclavable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#21527A]"
                    />
                    <span>Autoclavável</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resumo / Argumento de Venda</label>
                <textarea
                  rows={2}
                  placeholder="Descrição técnica resumida..."
                  value={editingProduct.descriptionShort || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionShort: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-[#21527A]"
                />
              </div>

              {/* SEÇÃO DE IMAGENS DO PRODUTO */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">Fotos do Produto (URLs)</label>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder="Cole o link/URL da imagem (ex: Mailchimp CDN, Imgur, AWS, etc.)"
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#21527A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl"
                  >
                    + Adicionar Foto
                  </button>
                </div>

                {/* GALERIA DE THUMBNAILS DAS FOTOS */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden group bg-slate-50">
                        {img.startsWith('http') ? (
                          <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[10px] text-slate-400 font-bold p-1 text-center">
                            SVG Icon
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(idx)}
                          className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover Imagem"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#21527A] hover:bg-[#122A48] text-white font-black text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Salvar Produto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE BANNER (CRUD) */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#122A48]">
                  {editingBanner.id ? 'Editar Banner Promocional' : 'Novo Banner Promocional'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure os dados, imagem e pontos de destaque que serão exibidos no topo da loja.
                </p>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBannerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Eyebrow (Texto Superior) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TECNOLOGIA DE ALTA PRECISÃO"
                    value={editingBanner.tag || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, tag: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selo / Badge de Desconto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PREMIUM, OFERTA, EXCLUSIVO"
                    value={editingBanner.discount || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, discount: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título Principal *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: MICROPIPETAS DE ALTA PRECISÃO"
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo / Descrição *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Desenvolvidas para máxima exatidão analítica, com ejetor de ponteiras ergonômico, isolamento térmico e suporte a autoclavagem."
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-[#21527A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem do Destaque *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={editingBanner.productImage || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, productImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Produto no Painel *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Micropipeta Série Premium FIP 1000 µL"
                    value={editingBanner.productName || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, productName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Categoria / Filtro *</label>
                <select
                  value={editingBanner.categoryKey || 'all'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, categoryKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#21527A]"
                >
                  <option value="all">Todas as Micropipetas</option>
                  <option value="fip">Linha FIP - Volume Fixo Autoclavável</option>
                  <option value="vib">Linha VIB - Volume Variável</option>
                  <option value="fib">Linha FIB - Volume Fixo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pontos de Destaque / Selos (Bullets)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ex: Totalmente Autoclavável (121°C)"
                    value={bannerHighlightInput}
                    onChange={(e) => setBannerHighlightInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#21527A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddBannerHighlight}
                    className="bg-[#21527A] hover:bg-[#122A48] text-white px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {editingBanner.highlights?.map((h, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBannerHighlight(i)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bannerActiveCheckbox"
                  checked={editingBanner.active !== false}
                  onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                  className="rounded border-slate-300 text-[#21527A] focus:ring-[#21527A]"
                />
                <label htmlFor="bannerActiveCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Banner ativo e visível na loja
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#21527A] hover:bg-[#122A48] text-white font-black text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Salvar Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
