import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteBannerProps {
  quote: string;
  citation: string;
  className?: string;
}

export const QuoteBanner: React.FC<QuoteBannerProps> = ({
  quote,
  citation,
  className = '',
}) => {
  return (
    <section className={`py-14 sm:py-20 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 border-t border-b border-neutral-200/60 relative overflow-hidden ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
        <Quote className="w-8 h-8 text-[#c93838]/40 mx-auto" />
        <p className="text-base sm:text-lg md:text-xl italic text-neutral-800 font-serif leading-relaxed max-w-3xl mx-auto">
          {quote}
        </p>
        <div className="pt-2 flex items-center justify-center space-x-2">
          <div className="w-8 h-[1px] bg-[#c93838]/40" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#c93838] font-sans">
            {citation}
          </p>
          <div className="w-8 h-[1px] bg-[#c93838]/40" />
        </div>
      </div>
    </section>
  );
};

export default QuoteBanner;
