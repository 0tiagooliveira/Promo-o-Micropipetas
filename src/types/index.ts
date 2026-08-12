export interface BannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  discount: string;
  categoryKey: string;
  productImage: string;
  productName: string;
  highlights: string[];
  active?: boolean;
}

export interface Product {
  id: string;
  sku: string; // Referência SKU
  name: string; // Descrição do Produto
  category: 'fib' | 'fip' | 'vib' | 'monocanal-var' | 'monocanal-fix' | 'multicanal' | 'eletronico' | 'suportes' | 'ponteiras';
  categoryLabel: string;
  priceNormal: number; // PV NORMAL
  pricePromo: number; // PROMO
  discountPercent: number;
  images: string[]; // Fotos para carrossel (múltiplas imagens)
  volumeRange: string; // ex: "100 - 1000 µL"
  increment?: string; // ex: "5 µL"
  autoclavable: boolean;
  inStock: boolean;
  descriptionShort: string;
  specs: {
    label: string;
    value: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteRequest {
  id: string;
  timestamp: string;
  buyerName?: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerCity?: string;
  buyerState?: string;
  ddd?: string;
  items: {
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  assignedSeller: {
    id: string;
    name: string;
    email: string;
    region: string;
  };
  isTestMode: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  status: 'Pendente' | 'Atendido' | 'Convertido' | 'Cancelado';
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  eventType: 'visit' | 'product_view' | 'modal_open' | 'add_to_quote' | 'whatsapp_click';
  sku?: string;
  productName?: string;
  city?: string;
  state?: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  utmSource?: string;
  utmCampaign?: string;
  ip?: string;
}

export interface KPIMetrics {
  totalVisits: number;
  quotesSent: number;
  conversionRate: number; // %
  potentialRevenue: number; // R$
  activeVisits24h: number;
  modalsOpened: number;
}

export interface SellerRoutingRule {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  ddds: string[]; // ex: ["11", "12", "13", "14", "15", "16", "17", "18", "19"]
  regionName: string;
}

export interface ProductPerformance {
  sku: string;
  name: string;
  views: number;
  modalOpens: number;
  quoteClicks: number;
  potentialRevenue: number;
}
