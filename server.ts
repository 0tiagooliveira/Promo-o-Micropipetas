import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Dados em Memória (Sincronizados com a base PostgreSQL para VPS)
let isTestMode = true; // Toggle "Modo de teste": redireciona e-mails para marketing.ionlab@gmail.com
const MARKETING_EMAIL = 'marketing.ionlab@gmail.com';

let products: any[] = [
  {
    id: 'prod-fib-0050',
    sku: 'FIB-0050',
    name: 'Micropipeta Monocanal Semi-Autoclavável 5 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '5 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 5 µL. Leveza e precisão.',
    images: []
  },
  {
    id: 'prod-fib-0080',
    sku: 'FIB-0080',
    name: 'Micropipeta Monocanal Semi-Autoclavável 25 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '25 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 25 µL.',
    images: []
  },
  {
    id: 'prod-fib-0110',
    sku: 'FIB-0110',
    name: 'Micropipeta Monocanal Semi-Autoclavável 200 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '200 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável com volume fixo de 200 µL.',
    images: []
  },
  {
    id: 'prod-fib-0120',
    sku: 'FIB-0120',
    name: 'Micropipeta Monocanal Semi-Autoclavável 250 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '250 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável de 250 µL.',
    images: []
  },
  {
    id: 'prod-fib-0150',
    sku: 'FIB-0150',
    name: 'Micropipeta Monocanal Semi-Autoclavável 500 µL',
    category: 'fib',
    categoryLabel: 'Monocanal Volume Fixo (FIB)',
    priceNormal: 105.00,
    pricePromo: 69.76,
    discountPercent: 34,
    volumeRange: '500 µL (Fixo)',
    autoclavable: true,
    inStock: true,
    descriptionShort: 'Micropipeta Monocanal Semi-Autoclavável de 500 µL.',
    images: []
  },
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
    descriptionShort: 'Série Premium Ionlab com volume fixo de 50 µL.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1a235267-e1d4-8526-4b12-58636497d95f.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/9ccc5ed2-9f6a-aa7e-a7f8-220748e751cf.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/339ef054-64bf-6eb2-6dc9-39c710bdf140.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/b7ba84ac-e65c-388e-9424-aa96ad4e07e9.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 200 µL.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/eeaa1422-cdd3-5873-4a8b-92c028981070.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/c0629fbd-d939-6c09-9a8d-af6acc602331.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/a7c922d9-2c4c-297b-afc0-389509aa6ba9.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/cb92416e-139b-c9bc-e346-2000e15222dc.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 250 µL.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/3aed3946-203c-5c6b-3770-38e1f40ca437.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/3685cde5-9f4d-79c9-650d-c9eb1e3e36d3.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/644d562d-9a45-2d28-916a-94ed323da92f.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1e2d74de-a656-60de-5863-5628fef15fc2.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/4c6cc0aa-a775-de57-1a25-63e189e1ebeb.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 500 µL.',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/21cb1617-cf5e-f246-1c17-b33f2e3c8a31.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/5f9a1176-ef5a-6500-0d4b-4de77475ad02.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/44bf593a-f1cc-5137-e0bd-efb4b3b67d22.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/69c8a9fc-bac3-12f7-7612-48eecffc5cbe.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 1000 µL (1 mL).',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/6aa9b9f5-65be-fd60-8e20-34093720cc91.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/d2c994c8-c3fd-7524-8dda-f3de9b3c8f30.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/7b9a30ec-7039-e932-71e8-e14270a5fc68.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/520783f2-964e-ff5c-3e48-7a776568bcd7.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 5000 µL (5 mL).',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/70dadd6a-22a5-7afc-1913-598b72aa5164.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/6c2c6ad0-dd30-fe55-48ed-4b3a2b914f58.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/221e8795-4326-209a-0d00-4852ba22dd9a.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/1c669adb-e1df-0a00-4598-c21fa3486144.png'
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
    descriptionShort: 'Série Premium Ionlab volume fixo 10000 µL (10 mL).',
    images: [
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/4efbd99d-fb2d-e544-1592-1228880f2799.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/c567e98a-85ee-5f2d-0800-f567da2c4a0d.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/0af94bd0-1875-19d7-2edf-a7a463a7ee19.png',
      'https://mcusercontent.com/d315c990296355ed94752eef4/images/657df024-1b56-533e-fda5-3a20b3b85d2e.png'
    ]
  },
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
    descriptionShort: 'Micropipeta Monocanal Variável VIB (0,5 - 5,0 µL). Vínculo obrigatório na promoção: 1 VIB para cada FIB/FIP comprada!',
    images: []
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
    descriptionShort: 'Micropipeta Monocanal Variável VIB (5,0 - 50,0 µL).',
    images: []
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
    descriptionShort: 'Micropipeta Monocanal Variável VIB (5,0 - 500,0 µL).',
    images: []
  }
];

const trackingEvents: any[] = [];
const quotes: any[] = [];

// API CRUD: Produtos
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProd = req.body;
  if (!newProd.id) {
    newProd.id = 'prod-' + Date.now();
  }
  products.unshift(newProd);
  res.status(201).json({ success: true, product: newProd });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const index = products.findIndex(p => p.id === id || p.sku === id);

  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    res.json({ success: true, product: products[index] });
  } else {
    res.status(404).json({ error: 'Produto não encontrado' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id && p.sku !== id);
  res.json({ success: true, message: 'Produto removido com sucesso' });
});

// API: Registra Eventos de Tracking (Visitas, Modais, WhatsApp Clicks)
app.post('/api/tracking/event', (req, res) => {
  const event = req.body;
  event.id = 'evt-' + Date.now();
  event.timestamp = new Date().toISOString();
  event.ip = req.ip || '189.120.45.88';
  trackingEvents.unshift(event);

  res.status(201).json({ success: true, eventId: event.id });
});

// API: Cria Cotação & Atribui Vendedor por DDD / Modo Teste
app.post('/api/quotes', (req, res) => {
  const quote = req.body;
  quote.id = quote.id || 'COT-' + Math.floor(1000 + Math.random() * 9000);
  quote.timestamp = new Date().toISOString();

  // Se Modo de Teste ativado, sobrescreve e-mail do vendedor para marketing.ionlab@gmail.com
  if (isTestMode) {
    quote.assignedSeller = {
      ...quote.assignedSeller,
      email: MARKETING_EMAIL,
      isTestMode: true
    };
  }

  quotes.unshift(quote);

  console.log(`[LOG COTAÇÃO - ${quote.id}] Vendedor: ${quote.assignedSeller.name} | Target E-mail: ${quote.assignedSeller.email}`);

  res.status(201).json({
    success: true,
    quoteId: quote.id,
    targetEmail: quote.assignedSeller.email,
    isTestMode
  });
});

// API: Estado Modo de Teste Marketing
app.get('/api/admin/test-mode', (req, res) => {
  res.json({ isTestMode, marketingEmail: MARKETING_EMAIL });
});

app.post('/api/admin/test-mode', (req, res) => {
  const { isTestMode: nextMode } = req.body;
  isTestMode = Boolean(nextMode);
  res.json({ success: true, isTestMode });
});

// Serve arquivos estáticos da build em produção
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(distIndex, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Ionlab Promo running on port ${PORT}`);
});
