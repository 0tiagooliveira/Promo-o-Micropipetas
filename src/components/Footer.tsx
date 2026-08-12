import React from 'react';
import { ShieldCheck, Truck, Award, Mail, Lock } from 'lucide-react';
import { IonlabLogo } from './IonlabLogo';

interface FooterProps {
  onToggleView: (view: 'store' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleView }) => {
  return (
    <footer id="contato" className="bg-gradient-to-b from-[#0B172E] via-[#001859] to-[#000E33] text-slate-300 pt-12 pb-8 border-t border-blue-900/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner de Garantias e Vantagens Ionlab */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-blue-900/40 text-center sm:text-left">
          <div className="flex items-center space-x-4 bg-[#001D6E]/40 p-4.5 rounded-2xl border border-blue-500/20 backdrop-blur-xs shadow-xs">
            <div className="p-3 bg-[#00207E] rounded-xl text-sky-300 shrink-0 border border-blue-400/30 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Atendimento Imediato</h4>
              <p className="text-xs text-slate-300/80">Atendimento imediato para todo o Brasil</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-[#001D6E]/40 p-4.5 rounded-2xl border border-blue-500/20 backdrop-blur-xs shadow-xs">
            <div className="p-3 bg-[#00207E] rounded-xl text-sky-300 shrink-0 border border-blue-400/30 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Calibração e Certificação</h4>
              <p className="text-xs text-slate-300/80">Acompanha laudo e certificado de aferição de fábrica</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-[#001D6E]/40 p-4.5 rounded-2xl border border-blue-500/20 backdrop-blur-xs shadow-xs">
            <div className="p-3 bg-[#00207E] rounded-xl text-sky-300 shrink-0 border border-blue-400/30 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Faturamento Rápido</h4>
              <p className="text-xs text-slate-300/80">Faturamento rápido direto de fábrica com nota fiscal</p>
            </div>
          </div>
        </div>

        {/* Links & Informações */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          
          <div className="md:col-span-5 space-y-4">
            <a 
              href="#inicio" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-3 group cursor-pointer"
              title="Voltar ao topo da tela inicial"
            >
              <IonlabLogo variant="white" height={52} className="transition-transform group-hover:scale-[1.03]" />
              <span className="bg-[#00207E] text-white font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-400/40 shadow-xs">
                PROMO
              </span>
            </a>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Líder no fornecimento de micropipetas autoclaváveis, multicanais, pipetadores e consumíveis para laboratórios analíticos, biotecnologia e análises clínicas em todo o Brasil.
            </p>
            <div className="pt-2 text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <a href="mailto:vendas2@ionlab.com.br" className="font-semibold hover:text-sky-300 transition-colors">
                  vendas2@ionlab.com.br
                </a>
              </div>
            </div>
          </div>

          {/* Links Navegação */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase text-sky-300 tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><a href="#inicio" className="hover:text-white transition-colors">Início / Destaques</a></li>
              <li><a href="#categorias" className="hover:text-white transition-colors">Categorias de Micropipetas</a></li>
              <li><a href="#produtos" className="hover:text-white transition-colors">Catálogo com Desconto</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Informações e Suporte</a></li>
            </ul>
          </div>

          {/* FAQ Rápido */}
          <div className="md:col-span-4 space-y-3" id="faq">
            <h4 className="font-bold text-xs uppercase text-sky-300 tracking-wider">Dúvidas Frequentes</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p><strong className="text-white block font-bold mb-0.5">Como funciona a cotação?</strong> Ao clicar em "Solicitar cotação", o WhatsApp do consultor da sua região é aberto com o seu pedido formatado.</p>
              <p><strong className="text-white block font-bold mb-0.5">As pipetas são autoclaváveis?</strong> As linhas de micropipetas Ionlab possuem especificações semi ou 100% autoclaváveis com indicação técnica em cada modelo.</p>
            </div>
          </div>

        </div>

        {/* Rodapé Final */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <p>© {new Date().getFullYear()} Ionlab Equipamentos Científicos. Todos os direitos reservados.</p>
            <button
              onClick={() => {
                onToggleView('admin');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              title="Acesso Restrito Admin"
              className="text-slate-600 hover:text-slate-300 p-1 rounded-md transition-colors opacity-30 hover:opacity-100 shrink-0"
              aria-label="Acesso Restrito Admin"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

