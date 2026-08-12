import { Product } from '../types';

// Função para gerar imagens SVG estilizadas de micropipetas Ionlab com alta fidelidade visual
function createMicropipetteSvg(sku: string, color: string, angleLabel: string, volumeText: string): string {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F8FAFC" />
        <stop offset="100%" stop-color="#E2E8F0" />
      </linearGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#F1F5F9" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${color}" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
      <linearGradient id="tipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.7" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.15" />
      </filter>
    </defs>
    
    <!-- Fundo Studio -->
    <rect width="400" height="400" rx="16" fill="url(#bgGrad)" />
    
    <!-- Moldura e Badge Ionlab -->
    <rect x="20" y="20" width="360" height="360" rx="12" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" />
    <rect x="32" y="32" width="100" height="26" rx="6" fill="#1E293B" />
    <text x="82" y="49" font-family="sans-serif" font-weight="bold" font-size="12" fill="#38BDF8" text-anchor="middle">IONLAB</text>
    
    <!-- Badge Destaque de Volume no Canto Superior Direito -->
    <rect x="230" y="30" width="130" height="30" rx="8" fill="${color}" />
    <text x="295" y="50" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">${volumeText}</text>
    
    <!-- Grupo Micropipeta -->
    <g filter="url(#shadow)" transform="translate(150, 45)">
      <!-- Embolo / Botão Superior -->
      <rect x="35" y="10" width="30" height="24" rx="4" fill="${color}" />
      <rect x="42" y="34" width="16" height="20" fill="#94A3B8" />
      
      <!-- Seletor de Volume (Visor Digital) -->
      <rect x="20" y="54" width="60" height="35" rx="4" fill="#0F172A" />
      <rect x="24" y="60" width="52" height="23" rx="2" fill="#FEF08A" />
      <text x="50" y="76" font-family="monospace" font-weight="black" font-size="10" fill="#0F172A" text-anchor="middle">${volumeText}</text>
      
      <!-- Corpo Ergonomico -->
      <path d="M 20 89 L 80 89 L 70 200 L 30 200 Z" fill="url(#bodyGrad)" stroke="#94A3B8" stroke-width="1" />
      
      <!-- Faixa Colorida da Marca Ionlab -->
      <rect x="22" y="95" width="56" height="14" rx="2" fill="${color}" />
      <text x="50" y="106" font-family="sans-serif" font-weight="bold" font-size="8" fill="#FFFFFF" text-anchor="middle">IONLAB AUTOCLAVABLE</text>
      
      <!-- Ejetor de Ponteiras -->
      <rect x="62" y="115" width="6" height="110" fill="#64748B" />
      <circle cx="65" cy="115" r="5" fill="${color}" />
      
      <!-- Cone de Encaixe -->
      <path d="M 35 200 L 65 200 L 58 290 L 42 290 Z" fill="#334155" />
      
      <!-- Ponteira Transparente -->
      <path d="M 43 290 L 57 290 L 52 340 L 48 340 Z" fill="url(#tipGrad)" stroke="#38BDF8" stroke-width="0.5" />
    </g>

    <!-- Tag SKU no Canto Inferior -->
    <rect x="32" y="342" width="110" height="26" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
    <text x="87" y="359" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F172A" text-anchor="middle">${sku}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// CATÁLOGO OFICIAL IONLAB - EXATAMENTE OS 15 PRODUTOS AUTORIZADOS
export const INITIAL_PRODUCTS: Product[] = [
  // --- LINHA FIB: MONOCANAL VOLUME FIXO SEMI-AUTOCLAVÁVEL ---
  {
    id: 'prod-fib-0050',
    sku: 'FIB-0050',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Fixo 5 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '5 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 5 µL. Leveza e precisão para dosagens rápidas.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/aa975f0d-9326-147c-5dd9-fe1931f5d16b.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/8a462ee8-3d72-8839-9d83-4b0809205356.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7f5e31e4-c748-a1d2-293b-e6169069703e.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d29140e0-682f-ae43-b167-5e22d44fba44.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/619738af-5aa7-7bcd-a9e5-a352ef1f8e16.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIB-0050 Semi-Autoclavável' },
      { label: 'Volume Fixo', value: '5 µL' },
      { label: 'Esterilização', value: 'Parte inferior autoclavável (121°C)' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fib-0080',
    sku: 'FIB-0080',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Fixo 25 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '25 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 25 µL. Ideal para ensaios clínicos e rotinas analíticas.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/8a462ee8-3d72-8839-9d83-4b0809205356.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7f5e31e4-c748-a1d2-293b-e6169069703e.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d29140e0-682f-ae43-b167-5e22d44fba44.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/619738af-5aa7-7bcd-a9e5-a352ef1f8e16.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/aa975f0d-9326-147c-5dd9-fe1931f5d16b.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIB-0080 Semi-Autoclavável' },
      { label: 'Volume Fixo', value: '25 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fib-0110',
    sku: 'FIB-0110',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Fixo 200 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '200 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 200 µL. Mecanismo de aspiração suave e consistente.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7f5e31e4-c748-a1d2-293b-e6169069703e.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d29140e0-682f-ae43-b167-5e22d44fba44.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/619738af-5aa7-7bcd-a9e5-a352ef1f8e16.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/aa975f0d-9326-147c-5dd9-fe1931f5d16b.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/8a462ee8-3d72-8839-9d83-4b0809205356.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIB-0110' },
      { label: 'Volume Fixo', value: '200 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fib-0120',
    sku: 'FIB-0120',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Fixo 250 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '250 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável de 250 µL. Alta reprodutibilidade e excelente manuseio para microbiologia.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d29140e0-682f-ae43-b167-5e22d44fba44.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/619738af-5aa7-7bcd-a9e5-a352ef1f8e16.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/aa975f0d-9326-147c-5dd9-fe1931f5d16b.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/8a462ee8-3d72-8839-9d83-4b0809205356.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7f5e31e4-c748-a1d2-293b-e6169069703e.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIB-0120' },
      { label: 'Volume Fixo', value: '250 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fib-0150',
    sku: 'FIB-0150',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Fixo 500 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '500 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável de 500 µL. Construção robusta e isolamento térmico na pega.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/619738af-5aa7-7bcd-a9e5-a352ef1f8e16.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/aa975f0d-9326-147c-5dd9-fe1931f5d16b.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/8a462ee8-3d72-8839-9d83-4b0809205356.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7f5e31e4-c748-a1d2-293b-e6169069703e.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d29140e0-682f-ae43-b167-5e22d44fba44.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIB-0150' },
      { label: 'Volume Fixo', value: '500 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },

  // --- LINHA FIP: MONOCANAL SÉRIE PREMIUM VOLUME FIXO (COM FOTOS REAIS IONLAB DIFERENCIADAS) ---
  {
    id: 'prod-fip-0070',
    sku: 'FIP-0070',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 50 µL',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '50 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab com volume fixo de 50 µL. Design ergonômico e calibração de fábrica.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1a235267-e1d4-8526-4b12-58636497d95f.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/9ccc5ed2-9f6a-aa7e-a7f8-220748e751cf.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/339ef054-64bf-6eb2-6dc9-39c710bdf140.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/b7ba84ac-e65c-388e-9424-aa96ad4e07e9.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0070 Série Premium' },
      { label: 'Volume Fixo', value: '50 µL' },
      { label: 'Certificação', value: 'Certificado de Aferição Individual ISO' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0090',
    sku: 'FIP-0090',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 200 µL',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '200 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 200 µL. Mecanismo ultrasave de ejeção e dosagem.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/eeaa1422-cdd3-5873-4a8b-92c028981070.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/c0629fbd-d939-6c09-9a8d-af6acc602331.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/a7c922d9-2c4c-297b-afc0-389509aa6ba9.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/cb92416e-139b-c9bc-e346-2000e15222dc.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0090 Premium' },
      { label: 'Volume Fixo', value: '200 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0100',
    sku: 'FIP-0100',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 250 µL',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '250 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 250 µL. Perfeita para rotinas contínuas de piptagem.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/3685cde5-9f4d-79c9-650d-c9eb1e3e36d3.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/644d562d-9a45-2d28-916a-94ed323da92f.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1e2d74de-a656-60de-5863-5628fef15fc2.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/3aed3946-203c-5c6b-3770-38e1f40ca437.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/4c6cc0aa-a775-de57-1a25-63e189e1ebeb.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0100 Premium' },
      { label: 'Volume Fixo', value: '250 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0110',
    sku: 'FIP-0110',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 500 µL',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '500 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 500 µL. Apoio de dedo ergonômico para mínimo cansaço.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/44bf593a-f1cc-5137-e0bd-efb4b3b67d22.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/5f9a1176-ef5a-6500-0d4b-4de77475ad02.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/69c8a9fc-bac3-12f7-7612-48eecffc5cbe.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/21cb1617-cf5e-f246-1c17-b33f2e3c8a31.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0110 Premium' },
      { label: 'Volume Fixo', value: '500 µL' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0120',
    sku: 'FIP-0120',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 1000 µL (1 mL)',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '1000 µL (1 mL Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 1000 µL (1 mL). Precisão máxima em volumetria.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7b9a30ec-7039-e932-71e8-e14270a5fc68.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/6aa9b9f5-65be-fd60-8e20-34093720cc91.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d2c994c8-c3fd-7524-8dda-f3de9b3c8f30.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/520783f2-964e-ff5c-3e48-7a776568bcd7.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0120 Premium' },
      { label: 'Volume Fixo', value: '1000 µL (1 mL)' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0150',
    sku: 'FIP-0150',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 5000 µL (5 mL)',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '5000 µL (5 mL Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 5000 µL (5 mL). Desempenho profissional para grandes alíquotas.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/6c2c6ad0-dd30-fe55-48ed-4b3a2b914f58.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/70dadd6a-22a5-7afc-1913-598b72aa5164.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/221e8795-4326-209a-0d00-4852ba22dd9a.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1c669adb-e1df-0a00-4598-c21fa3486144.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0150 Premium' },
      { label: 'Volume Fixo', value: '5000 µL (5 mL)' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-fip-0160',
    sku: 'FIP-0160',
    name: 'Micropipeta Monocanal Série Premium Volume Fixo 10000 µL (10 mL)',
    category: 'fip',
    categoryLabel: 'Série Premium Fixo (FIP)',
    priceNormal: 90.00,
    pricePromo: 60.80,
    discountPercent: 32,
    volumeRange: '10000 µL (10 mL Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Série Premium Ionlab volume fixo 10000 µL (10 mL). Alta estabilidade mecânica.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/c567e98a-85ee-5f2d-0800-f567da2c4a0d.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/4efbd99d-fb2d-e544-1592-1228880f2799.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/0af94bd0-1875-19d7-2edf-a7a463a7ee19.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/657df024-1b56-533e-fda5-3a20b3b85d2e.png'
    ],
    specs: [
      { label: 'Modelo', value: 'FIP-0160 Premium' },
      { label: 'Volume Fixo', value: '10000 µL (10 mL)' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },

  // --- LINHA VIB: MONOCANAL VOLUME VARIÁVEL SEMI-AUTOCLAVÁVEL ---
  {
    id: 'prod-vib-100',
    sku: 'VIB-100',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Variável 0,5 - 5,0 µL',
    category: 'vib',
    categoryLabel: 'Monocanal Variável (VIB)',
    priceNormal: 130.00,
    pricePromo: 83.44,
    discountPercent: 36,
    volumeRange: '0,5 - 5,0 µL',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Variável VIB (0,5 - 5,0 µL). Vínculo promocional obrigatório: ativa desconto combinado FIB/FIP!',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/2678c8b2-a915-8e08-794e-c101350e70ce.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/73db0201-9177-f240-4ea5-580c1624dff9.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/9c51e17a-3377-29a5-ef47-bc9407c3360d.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/ea57ae10-016f-12b4-58b0-a92d9068c468.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/a0d77386-e4f2-7ac2-2900-78be1f120627.png'
    ],
    specs: [
      { label: 'Modelo', value: 'VIB-100' },
      { label: 'Faixa de Volume', value: '0,5 µL a 5,0 µL' },
      { label: 'Regra Promocional', value: 'Ativa desconto combinado FIB/FIP' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-vib-500',
    sku: 'VIB-500',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Variável 5,0 - 50,0 µL',
    category: 'vib',
    categoryLabel: 'Monocanal Variável (VIB)',
    priceNormal: 130.00,
    pricePromo: 83.44,
    discountPercent: 36,
    volumeRange: '5,0 - 50,0 µL',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Variável VIB (5,0 - 50,0 µL). Ajuste digital continuo com engrenagem metálica.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/73db0201-9177-f240-4ea5-580c1624dff9.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/9c51e17a-3377-29a5-ef47-bc9407c3360d.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/ea57ae10-016f-12b4-58b0-a92d9068c468.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/a0d77386-e4f2-7ac2-2900-78be1f120627.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/2678c8b2-a915-8e08-794e-c101350e70ce.png'
    ],
    specs: [
      { label: 'Modelo', value: 'VIB-500' },
      { label: 'Faixa de Volume', value: '5,0 µL a 50,0 µL' },
      { label: 'Regra Promocional', value: 'Ativa desconto combinado FIB/FIP' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  },
  {
    id: 'prod-vib-1000',
    sku: 'VIB-1000',
    name: 'Micropipeta Monocanal Semi-Autoclavável Volume Variável 5,0 - 500,0 µL',
    category: 'vib',
    categoryLabel: 'Monocanal Variável (VIB)',
    priceNormal: 130.00,
    pricePromo: 83.44,
    discountPercent: 36,
    volumeRange: '5,0 - 500,0 µL',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Variável VIB (5,0 - 500,0 µL). Ampla versatilidade operacional.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/9c51e17a-3377-29a5-ef47-bc9407c3360d.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/ea57ae10-016f-12b4-58b0-a92d9068c468.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/a0d77386-e4f2-7ac2-2900-78be1f120627.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/2678c8b2-a915-8e08-794e-c101350e70ce.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/73db0201-9177-f240-4ea5-580c1624dff9.png'
    ],
    specs: [
      { label: 'Modelo', value: 'VIB-1000' },
      { label: 'Faixa de Volume', value: '5,0 µL a 500,0 µL' },
      { label: 'Regra Promocional', value: 'Ativa desconto combinado FIB/FIP' },
      { label: 'Garantia', value: 'Suporte e Garantia Ionlab' }
    ]
  }
];

export const INITIAL_SELLER_RULES = [
  {
    id: 'seller-1',
    sellerName: 'EDUARDO FELIPE DE FARIAS',
    sellerEmail: 'vendas3@ionlab.com.br',
    sellerPhone: '(41) 3073-0346',
    ddds: ['61', '04', '13', '62', '63', '64', '65', '66', '67', '68', '69'],
    regionName: 'Brasília - DF & Centro-Oeste'
  },
  {
    id: 'seller-2',
    sellerName: 'RODRIGO SAMUEL DOS SANTOS',
    sellerEmail: 'vendas2@ionlab.com.br',
    sellerPhone: '(41) 3073-0347',
    ddds: ['21', '71', '73', '74', '75', '77', '22', '24', '27', '28', '79'],
    regionName: 'Rio de Janeiro & Bahia'
  },
  {
    id: 'seller-3',
    sellerName: 'VITOR FLORIANO GOOD MISSEL',
    sellerEmail: 'vendas5@ionlab.com.br',
    sellerPhone: '(41) 3073-0340',
    ddds: ['11', '12', '14', '15', '16', '17', '18', '19', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55'],
    regionName: 'São Paulo (DDD 11), SP Interior, MG & Sul'
  },
  {
    id: 'seller-4',
    sellerName: 'WELLINGTON SILVA FELINTO',
    sellerEmail: 'vendas6@ionlab.com.br',
    sellerPhone: '(41) 3073-0346',
    ddds: ['00', '83', '85', '86', '88', '81', '82', '84', '87', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
    regionName: 'Nordeste (83, 85, 86, 88, 00) & Norte'
  }
];
