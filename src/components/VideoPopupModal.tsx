import React, { useState, useEffect } from 'react';
import { X, Play, Sparkles, ArrowRight } from 'lucide-react';
import { IonlabLogo } from './IonlabLogo';

interface VideoPopupModalProps {
  videoUrl?: string;
}

export const VideoPopupModal: React.FC<VideoPopupModalProps> = ({
  videoUrl = 'https://www.youtube.com/embed/R1KL9Pr9M3c?autoplay=1&mute=1&enablejsapi=1&rel=0'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Abre o popup do vídeo automaticamente ao carregar a página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Escuta o evento de finalização do vídeo do YouTube (PostMessage API)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // YouTube API message when video finishes playing (info === 0 or state === 0)
        if (data && (data.event === 'onStateChange' || data.info === 0 || data.data === 0)) {
          if (data.info === 0 || data.data === 0) {
            setIsOpen(false);
          }
        }
      } catch (e) {
        // Ignore non-json iframe messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-fade-in">
      {/* Container do Modal com fundo branco nítido (quebra do azul) */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800">
        
        {/* Cabeçalho do Popup em Branco */}
        <div className="p-4 sm:p-5 bg-white flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <IonlabLogo variant="colored" height={40} />
            <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs font-extrabold text-[#00207E]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Apresentação Oficial Ionlab</span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all border border-slate-200/60"
            title="Fechar vídeo"
            aria-label="Fechar vídeo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área do Vídeo de Alta Definição */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            src={videoUrl}
            title="Apresentação Ionlab"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer do Modal com Quebra de Cor em Fundo Claro */}
        <div className="p-4 sm:p-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-center sm:text-left">
            <h4 className="font-extrabold text-sm sm:text-base text-[#00207E] flex items-center justify-center sm:justify-start space-x-1.5">
              <Play className="w-4 h-4 text-[#00207E] fill-current" />
              <span>Conheça Nossas Linhas de Micropipetas</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Alta precisão, modelos autoclaváveis e preços direto da fábrica.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#00207E] via-[#002D96] to-[#0042B3] hover:from-[#00175B] hover:to-[#003494] text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Ver Ofertas do Mês</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
