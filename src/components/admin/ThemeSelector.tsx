'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiEye, FiRefreshCw } from 'react-icons/fi';

const THEMES = [
  { name: 'base', label: 'Base' },
  { name: 'arabian', label: 'Arabian' },
  { name: 'beautiful-floral', label: 'Beautiful Floral' },
  { name: 'blueroses', label: 'Blue Roses' },
  { name: 'floral', label: 'Floral' },
  { name: 'greenflower', label: 'Green Flower' },
  { name: 'hwflower', label: 'HW Flower' },
  { name: 'islamic1', label: 'Islamic 1' },
  { name: 'jellyblack', label: 'Jelly Black' },
  { name: 'mandala', label: 'Mandala' },
  { name: 'prettyflower', label: 'Pretty Flower' },
  { name: 'purpleflower', label: 'Purple Flower' },
  { name: 'radiantdark', label: 'Radiant Dark' },
  { name: 'radiantyellow', label: 'Radiant Yellow' },
  { name: 'redroses', label: 'Red Roses' },
  { name: 'rustic', label: 'Rustic' },
  { name: 'sketchflower', label: 'Sketch Flower' },
  { name: 'tapis', label: 'Tapis' },
  { name: 'tealflower', label: 'Teal Flower' },
  { name: 'twelve', label: 'Twelve' },
  { name: 'vintage-islamic', label: 'Vintage Islamic' },
  { name: 'watercolor1', label: 'Watercolor 1' },
  { name: 'watercolor2', label: 'Watercolor 2' },
  { name: 'watercolor3', label: 'Watercolor 3' },
  { name: 'watercolor4', label: 'Watercolor 4' },
  { name: 'watercolor5', label: 'Watercolor 5' },
];

interface Props {
  currentTheme: string;
  onSelect: (theme: string) => void;
  saving: boolean;
}

export default function ThemeSelector({ currentTheme, onSelect, saving }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pilih Tema Undangan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Pilih tema tampilan untuk website undangan pernikahan</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {THEMES.map((theme) => {
          const isActive = currentTheme === theme.name;
          return (
            <div
              key={theme.name}
              className={`admin-card overflow-hidden group cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]'
                  : 'hover:shadow-md hover:scale-[1.01]'
              }`}
              onClick={() => onSelect(theme.name)}
            >
              {/* Preview Image */}
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img
                  src={`/themes/${theme.name}/preview.png`}
                  alt={theme.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/themes/base/preview.png';
                  }}
                />
                {/* Active overlay */}
                {isActive && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <FiCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800 truncate">{theme.label}</p>
                  <div className="flex items-center gap-1">
                    {isActive && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{theme.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <FiRefreshCw className="w-4 h-4 animate-spin" />
          Menyimpan tema...
        </div>
      )}
    </div>
  );
}


