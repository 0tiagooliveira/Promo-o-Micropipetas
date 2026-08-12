import { Product, QuoteRequest, TrackingEvent, KPIMetrics, SellerRoutingRule, ProductPerformance, BannerItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SELLER_RULES } from '../data/products';

// Estado local para execução standalone e sincronizado com o Backend Express
let mockProducts: Product[] = [...INITIAL_PRODUCTS];
let mockSellerRules: SellerRoutingRule[] = [...INITIAL_SELLER_RULES];
let isMarketingTestMode = true; // "Modo de teste": envia para marketing.ionlab@gmail.com
const MARKETING_EMAIL = 'marketing.ionlab@gmail.com';
const MAIN_WHATSAPP_NUMBER = '5511988887777'; // Telefone Ionlab Comercial

let trackingEvents: TrackingEvent[] = [];

let quotesList: QuoteRequest[] = [];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        mockProducts = data;
      }
    }
  } catch {
    // Fallback local
  }
  return mockProducts;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const isEdit = Boolean(product.id && mockProducts.some(p => p.id === product.id));

  // Auto-calcular % de desconto se não fornecido ou divergente
  const normal = Number(product.priceNormal) || 0;
  const promo = Number(product.pricePromo) || 0;
  let discountPercent = product.discountPercent;
  if (normal > 0 && promo > 0 && normal > promo) {
    discountPercent = Math.round(((normal - promo) / normal) * 100);
  }

  const processedProduct: Product = {
    id: product.id || 'prod-' + Date.now(),
    sku: product.sku || 'ION-' + Math.floor(100 + Math.random() * 900),
    name: product.name || 'Nova Micropipeta Ionlab',
    category: product.category || 'monocanal-var',
    categoryLabel: product.categoryLabel || 'Monocanal Variável',
    priceNormal: normal,
    pricePromo: promo,
    discountPercent: discountPercent || 0,
    volumeRange: product.volumeRange || 'Volume Sob Consulta',
    autoclavable: product.autoclavable ?? true,
    inStock: product.inStock ?? true,
    descriptionShort: product.descriptionShort || 'Micropipeta com alta precisão e certificado de calibração.',
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : ['https://mcusercontent.com/d315c990296355ed94752eef4/images/1a235267-e1d4-8526-4b12-58636497d95f.png'],
    specs: product.specs || [
      { label: 'Certificação', value: 'ISO 8655 / CE' },
      { label: 'Garantia', value: '2 Anos Ionlab' }
    ]
  };

  if (isEdit) {
    const idx = mockProducts.findIndex(p => p.id === processedProduct.id);
    if (idx !== -1) {
      mockProducts[idx] = processedProduct;
    }
    try {
      await fetch(`/api/products/${processedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedProduct)
      });
    } catch {
      // API fallback
    }
  } else {
    mockProducts.unshift(processedProduct);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedProduct)
      });
    } catch {
      // API fallback
    }
  }

  return processedProduct;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  mockProducts = mockProducts.filter(p => p.id !== productId && p.sku !== productId);
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
  } catch {
    // API fallback
  }
  return true;
}

interface LocationInfo {
  city: string;
  state: string;
}

let cachedClientLocation: LocationInfo | null = null;

export async function detectClientLocation(): Promise<LocationInfo> {
  if (cachedClientLocation) return cachedClientLocation;

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.region_code) {
        cachedClientLocation = {
          city: data.city || data.region || 'Brasil',
          state: data.region_code || 'BR'
        };
        return cachedClientLocation;
      }
    }
  } catch {
    // Fallback
  }

  try {
    const res2 = await fetch('https://ip-api.com/json/?fields=status,region,regionName,city', { signal: AbortSignal.timeout(2500) });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.region) {
        cachedClientLocation = {
          city: data2.city || data2.regionName || 'Brasil',
          state: data2.region || 'BR'
        };
        return cachedClientLocation;
      }
    }
  } catch {
    //
  }

  cachedClientLocation = { city: 'Brasil', state: 'BR' };
  return cachedClientLocation;
}

export async function sendTrackingEvent(event: Omit<TrackingEvent, 'id' | 'timestamp'>): Promise<void> {
  let locationCity = event.city;
  let locationState = event.state;

  if (!locationState || locationState === 'BR' || (locationState === 'SP' && (!locationCity || locationCity === 'São Paulo'))) {
    const detected = await detectClientLocation();
    locationCity = detected.city;
    locationState = detected.state;
  }

  const newEvt: TrackingEvent = {
    ...event,
    id: 'evt-' + Date.now(),
    timestamp: new Date().toISOString(),
    city: locationCity || 'Brasil',
    state: locationState || 'BR',
    ip: event.ip || '189.120.45.' + Math.floor(Math.random() * 200)
  };
  trackingEvents.unshift(newEvt);

  try {
    await fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvt)
    });
  } catch {
    // Ignora erro backend
  }
}

export function matchSellerByDDD(ddd: string): { name: string; email: string; phone: string; region: string } {
  const cleanDdd = ddd.replace(/\D/g, '');
  const rule = mockSellerRules.find(r => r.ddds.includes(cleanDdd));

  if (rule) {
    return {
      name: rule.sellerName,
      email: isMarketingTestMode ? MARKETING_EMAIL : rule.sellerEmail,
      phone: rule.sellerPhone || '(41) 3073-0340',
      region: rule.regionName
    };
  }

  const defaultRule = mockSellerRules.find(r => r.sellerEmail === 'vendas5@ionlab.com.br') || mockSellerRules[0];
  return {
    name: defaultRule ? defaultRule.sellerName : 'VITOR FLORIANO GOOD MISSEL',
    email: isMarketingTestMode ? MARKETING_EMAIL : (defaultRule ? defaultRule.sellerEmail : 'vendas5@ionlab.com.br'),
    phone: defaultRule?.sellerPhone || '(41) 3073-0340',
    region: defaultRule ? defaultRule.regionName : 'São Paulo / Atendimento Geral'
  };
}

export async function submitQuoteRequest(data: {
  buyerName?: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerCity?: string;
  buyerState?: string;
  items: { sku: string; name: string; quantity: number; unitPrice: number; totalPrice: number }[];
  utmSource?: string;
  utmCampaign?: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
}): Promise<{ quoteId: string; whatsappUrl: string; assignedSellerName: string; targetEmail: string }> {
  const totalAmount = data.items.reduce((acc, item) => acc + item.totalPrice, 0);

  // Extrai DDD do telefone ex: "(11) 98888-7777" -> "11"
  const dddMatch = data.buyerPhone.match(/\(?(\d{2})\)?/);
  const ddd = dddMatch ? dddMatch[1] : '11';

  const sellerInfo = matchSellerByDDD(ddd);

  const quoteId = 'COT-' + Math.floor(1000 + Math.random() * 9000);

  const newQuote: QuoteRequest = {
    id: quoteId,
    timestamp: new Date().toISOString(),
    buyerName: data.buyerName || 'Cliente Ionlab',
    buyerPhone: data.buyerPhone,
    buyerEmail: data.buyerEmail,
    buyerCity: data.buyerCity || 'São Paulo',
    buyerState: data.buyerState || 'SP',
    ddd,
    items: data.items,
    totalAmount,
    assignedSeller: {
      id: 'sel-' + ddd,
      name: sellerInfo.name,
      email: sellerInfo.email,
      region: sellerInfo.region
    },
    isTestMode: isMarketingTestMode,
    utmSource: data.utmSource,
    utmCampaign: data.utmCampaign,
    deviceType: data.deviceType,
    status: 'Pendente'
  };

  quotesList.unshift(newQuote);

  // Registra evento de cotação
  data.items.forEach(item => {
    sendTrackingEvent({
      eventType: 'whatsapp_click',
      sku: item.sku,
      productName: item.name,
      city: data.buyerCity,
      state: data.buyerState,
      device: data.deviceType,
      utmSource: data.utmSource
    });
  });

  // Tenta enviar para backend
  try {
    await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote)
    });
  } catch {
    // Local fallback
  }

  // Gera mensagem formatada para WhatsApp
  const formattedItems = data.items.map(i => `• *${i.sku}* - ${i.name}\n   Qtd: ${i.quantity} x R$ ${i.unitPrice.toFixed(2)} = *R$ ${i.totalPrice.toFixed(2)}*`).join('\n\n');

  const textMessage = `Olá! Gostaria de solicitar uma cotação oficial Ionlab com desconto promocional:\n\n` +
    `📋 *Cotação Ref:* #${quoteId}\n` +
    `👤 *Cliente:* ${data.buyerName || 'Não informado'}\n` +
    `📞 *Contato:* ${data.buyerPhone}\n` +
    `📍 *Localização:* ${data.buyerCity || ''}/${data.buyerState || ''}\n\n` +
    `📦 *ITENS DA COTAÇÃO:*\n${formattedItems}\n\n` +
    `💰 *VALOR TOTAL ESTIMADO:* *R$ ${totalAmount.toFixed(2)}*\n\n` +
    `Por favor, me confirme as condições de pagamento, frete e prazo de entrega.`;

  const encodedMsg = encodeURIComponent(textMessage);
  const whatsappUrl = `https://wa.me/${MAIN_WHATSAPP_NUMBER}?text=${encodedMsg}`;

  return {
    quoteId,
    whatsappUrl,
    assignedSellerName: sellerInfo.name,
    targetEmail: sellerInfo.email
  };
}

export function getKPIMetrics(): KPIMetrics {
  const totalVisits = trackingEvents.filter(e => e.eventType === 'visit').length;
  const quotesSent = quotesList.length;
  const conversionRate = totalVisits > 0 ? Number(((quotesSent / totalVisits) * 100).toFixed(2)) : 0;
  const potentialRevenue = quotesList.reduce((acc, q) => acc + q.totalAmount, 0);
  const modalsOpened = trackingEvents.filter(e => e.eventType === 'modal_open').length;

  const now = Date.now();
  const activeVisits24h = trackingEvents.filter(e => e.eventType === 'visit' && (now - new Date(e.timestamp).getTime()) < 24 * 60 * 60 * 1000).length;

  return {
    totalVisits,
    quotesSent,
    conversionRate,
    potentialRevenue,
    activeVisits24h,
    modalsOpened
  };
}

export function getLiveTrackingEvents(): TrackingEvent[] {
  return [...trackingEvents];
}

export function getQuotesList(): QuoteRequest[] {
  return [...quotesList];
}

export function getIsTestMode(): boolean {
  return isMarketingTestMode;
}

export function setTestMode(enabled: boolean): void {
  isMarketingTestMode = enabled;
  try {
    fetch('/api/admin/test-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isTestMode: enabled })
    });
  } catch {
    // Local fallback
  }
}

export function getSellerRules(): SellerRoutingRule[] {
  return [...mockSellerRules];
}

export function updateSellerRules(rules: SellerRoutingRule[]): void {
  mockSellerRules = rules;
}

export function getProductPerformance(): ProductPerformance[] {
  return mockProducts.map(p => {
    const skuEvents = trackingEvents.filter(e => e.sku === p.sku);
    const views = skuEvents.filter(e => e.eventType === 'product_view').length;
    const modalOpens = skuEvents.filter(e => e.eventType === 'modal_open').length;
    const quoteClicks = skuEvents.filter(e => e.eventType === 'whatsapp_click').length;
    const potentialRevenue = quoteClicks * p.pricePromo;

    return {
      sku: p.sku,
      name: p.name,
      views,
      modalOpens,
      quoteClicks,
      potentialRevenue
    };
  }).sort((a, b) => b.potentialRevenue - a.potentialRevenue || b.views - a.views);
}

// Banners Promocionais - Armazenamento e Gestão
export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    tag: 'DESEMPENHO ANALÍTICO SUPERIOR',
    title: 'MICROPIPETAS DE ALTA PRECISÃO',
    subtitle: 'Desenvolvidas para máxima exatidão analítica, com ejetor de ponteiras ergonômico, isolamento térmico e suporte a autoclavagem.',
    discount: 'PREMIUM',
    categoryKey: 'all',
    productImage: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/5de3d244-f240-0376-6c4a-4d7fa4ef7da4.png',
    productName: 'Micropipeta Série Premium FIP 1000 µL',
    highlights: ['Certificado de Calibração', 'Garantia Direta de Fábrica', 'Calibração ISO 8655'],
    active: true
  },
  {
    id: 'banner-2',
    tag: 'MÁXIMA ERGONOMIA & DURABILIDADE',
    title: 'SÉRIE PREMIUM VOLUME FIXO',
    subtitle: 'Micropipetas FIP totalmente autoclaváveis a 121°C. Mecanismo de aspiração suave, isolamento térmico e ejetor integrado.',
    discount: 'OFERTA',
    categoryKey: 'fip',
    productImage: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/1a235267-e1d4-8526-4b12-58636497d95f.png',
    productName: 'Linha FIP - Volume Fixo Autoclavável',
    highlights: ['Totalmente Autoclavável', 'Alta Repetibilidade', 'Ejetor Ergonômico'],
    active: true
  },
  {
    id: 'banner-3',
    tag: 'VERSATILIDADE PARA LABORATÓRIOS',
    title: 'LINHA MONOCANAL VARIÁVEL VIB',
    subtitle: 'Ajuste volumétrico micrométrico com visor digital de alta visibilidade. Perfeito para dosagens analíticas e pesquisa.',
    discount: 'EXCLUSIVO',
    categoryKey: 'vib',
    productImage: 'https://mcusercontent.com/d315c990296355ed94752eef4/images/2678c8b2-a915-8e08-794e-c101350e70ce.png',
    productName: 'Linha VIB - Volume Variável',
    highlights: ['Trava de Segurança', 'Visor Contador Digital', 'Resistente a Reagentes'],
    active: true
  }
];

const BANNERS_STORAGE_KEY = 'ionlab_store_banners_v3';

export function getBanners(): BannerItem[] {
  try {
    const stored = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_BANNERS;
}

export function saveBanners(banners: BannerItem[]): void {
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new Event('ionlab_banners_updated'));
  } catch {
    // Fallback
  }
}

export function saveBannerItem(banner: Partial<BannerItem>): BannerItem[] {
  const current = getBanners();
  const id = banner.id || 'banner-' + Date.now();
  
  let highlightsArray: string[] = ['Qualidade Ionlab'];
  if (Array.isArray(banner.highlights)) {
    highlightsArray = banner.highlights;
  } else if (typeof banner.highlights === 'string') {
    highlightsArray = (banner.highlights as string).split(',').map(s => s.trim()).filter(Boolean);
  }

  const processed: BannerItem = {
    id,
    tag: banner.tag || 'DESTAQUE IONLAB',
    title: banner.title || 'NOVA PROMOÇÃO IONLAB',
    subtitle: banner.subtitle || 'Confira nossas soluções em micropipetas analíticas de alta precisão.',
    discount: banner.discount || 'OFERTA',
    categoryKey: banner.categoryKey || 'all',
    productImage: banner.productImage || 'https://mcusercontent.com/d315c990296355ed94752eef4/images/7b9a30ec-7039-e932-71e8-e14270a5fc68.png',
    productName: banner.productName || 'Micropipeta Ionlab',
    highlights: highlightsArray.length > 0 ? highlightsArray : ['Garantia Ionlab'],
    active: banner.active ?? true
  };

  const existingIdx = current.findIndex(b => b.id === id);
  if (existingIdx !== -1) {
    current[existingIdx] = processed;
  } else {
    current.push(processed);
  }

  saveBanners(current);
  return current;
}

export function deleteBannerItem(bannerId: string): BannerItem[] {
  const current = getBanners().filter(b => b.id !== bannerId);
  saveBanners(current);
  return current;
}

