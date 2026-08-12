import React, { useState, useEffect } from 'react';
import { CountdownTimer } from './CountdownTimer';
import { BannerItem } from '../types';
import { getBanners } from '../services/api';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle2,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (categoryKey: string) => void;
  selectedCategory: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerSlides, setBannerSlides] = useState<BannerItem[]>([]);

  const reloadBanners = () => {
    const list = getBanners().filter(b => b.active !== false);
    setBannerSlides(list.length > 0 ? list : getBanners());
  };

  useEffect(() => {
    reloadBanners();
    const handleUpdate = () => reloadBanners();
    window.addEventListener('ionlab_banners_updated', handleUpdate);
    return () => window.removeEventListener('ionlab_banners_updated', handleUpdate);
  }, []);

  // Carrossel de Banners Automático com intervalo suave
  useEffect(() => {
    if (bannerSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    if (bannerSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    if (bannerSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const activeBanner = bannerSlides[currentSlide] || bannerSlides[0];

  if (!activeBanner) return null;

  return (
    <section id="inicio" className="bg-[#F0F4F8] pt-3 pb-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Banner de Urgência com Cronômetro Oficial */}
        <CountdownTimer />

        {/* ÁREA PRINCIPAL DO CARROSSEL DE ENTRADA DO SITE */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-700/60 flex items-center justify-center group transition-all duration-500">
          
          {/* Banner em Largura e Altura Totais */}
          <a
            href="#produtos"
            onClick={() => onSelectCategory(activeBanner.categoryKey)}
            className="w-full h-full block relative overflow-hidden flex items-center justify-center bg-slate-900"
          >
            <img
              src={activeBanner.productImage}
              alt={activeBanner.title || activeBanner.productName}
              className="w-full h-auto max-h-[520px] object-contain sm:object-cover w-full block transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </a>

          {/* Setas de Navegação Esquerda / Direita */}
          <button
            onClick={prevSlide}
            aria-label="Banner anterior"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-[#00207E] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            aria-label="Próximo banner"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-[#00207E] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores de Paginação (Dots) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 bg-slate-950/50 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ir para banner ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-8 bg-sky-400 shadow-md shadow-sky-400/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Régua de Diferenciais Ionlab (Trust Pillars) na Entrada do Site */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">Faturamento Direto</h2>
              <p className="text-[11px] text-slate-500 font-normal">Preço de fábrica para empresas</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">Certificado Incluso</h2>
              <p className="text-[11px] text-slate-500 font-normal">Calibração individual ISO</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">Pronta Entrega</h2>
              <p className="text-[11px] text-slate-500 font-normal">Envio para todo o Brasil</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">Suporte Especializado</h2>
              <p className="text-[11px] text-slate-500 font-normal">Atendimento imediato</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
