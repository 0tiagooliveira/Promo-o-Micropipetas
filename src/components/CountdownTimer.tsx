import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 21,
    hours: 12,
    minutes: 30,
    seconds: 15
  });

  useEffect(() => {
    // Contador regressivo em tempo real
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#001756] via-[#00207E] to-[#0046B8] rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-blue-500/30 my-4 relative overflow-hidden">
      {/* Glow e efeito de iluminação no fundo */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Esquerda: Ícone + Tag + Textos */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Clock className="w-6 h-6 text-sky-200" />
          </div>

          <div className="space-y-1">
            <div className="inline-block bg-white text-[#00207E] text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
              OFERTA POR TEMPO LIMITADO
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Garanta a condição antes que o tempo acabe.
            </h3>
            <p className="text-xs text-sky-100/90 font-medium">
              Encerra em 31/08/2026 ou enquanto durarem os estoques.
            </p>
          </div>
        </div>

        {/* Direita: Blocos do Cronômetro + Botão Ação */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/15">
          
          <div className="flex items-center space-x-2">
            {/* Dias */}
            <div className="bg-white text-[#00207E] rounded-xl px-3 py-1.5 text-center min-w-[58px] shadow-sm">
              <span className="block font-black text-lg sm:text-xl leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">DIAS</span>
            </div>

            {/* Horas */}
            <div className="bg-white text-[#00207E] rounded-xl px-3 py-1.5 text-center min-w-[58px] shadow-sm">
              <span className="block font-black text-lg sm:text-xl leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">HORAS</span>
            </div>

            {/* Minutos */}
            <div className="bg-white text-[#00207E] rounded-xl px-3 py-1.5 text-center min-w-[58px] shadow-sm">
              <span className="block font-black text-lg sm:text-xl leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">MIN</span>
            </div>

            {/* Segundos */}
            <div className="bg-white text-[#00207E] rounded-xl px-3 py-1.5 text-center min-w-[58px] shadow-sm">
              <span className="block font-black text-lg sm:text-xl leading-none text-blue-600">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">SEG</span>
            </div>
          </div>

          {/* Botão de Ação */}
          <a
            href="#produtos"
            className="bg-white hover:bg-sky-50 text-[#00207E] font-extrabold text-xs py-2.5 px-5 rounded-full shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Escolher produtos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

        </div>

      </div>
    </div>
  );
};
