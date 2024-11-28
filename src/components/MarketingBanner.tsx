import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MarketingBannerProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export const MarketingBanner: React.FC<MarketingBannerProps> = ({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <div className="bg-indigo-900 rounded-xl p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/70 mb-6">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onPrimaryClick}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold flex items-center gap-2"
            >
              {primaryButtonText}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onSecondaryClick}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 font-semibold"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
        <div className="w-32 h-32 bg-indigo-800 rounded-xl flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>
      </div>
    </div>
  );
};
