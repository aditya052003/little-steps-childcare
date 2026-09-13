import React from 'react';
import { Search, Moon, Sun, Baby, Clock, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset }) {
  const handleToggle24x7 = () => {
    setFilters(prev => ({
      ...prev,
      is24x7: prev.is24x7 === 'true' ? '' : 'true'
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-8 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Search Daycares or Area
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Downtown, Bloom Haven, Tech Hub..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Age Group Filter */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Baby className="w-3.5 h-3.5 text-brand-500" />
            Child Age Group
          </label>
          <select
            value={filters.ageGroup}
            onChange={(e) => setFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          >
            <option value="">All Age Groups</option>
            <option value="infant">Infant (0 – 12 months)</option>
            <option value="toddler">Toddler (1 – 3 years)</option>
            <option value="preschool">Preschool (3 – 6 years)</option>
          </select>
        </div>

        {/* Timing Shift Filter */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Timing / Shift Type
          </label>
          <select
            value={filters.timingType}
            onChange={(e) => setFilters(prev => ({ ...prev, timingType: e.target.value }))}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          >
            <option value="">Any Schedule</option>
            <option value="day">Day Care (Morning - Evening)</option>
            <option value="night">Night Shift Care (7 PM - 7 AM)</option>
            <option value="emergency">Emergency Drop-in (Instant)</option>
          </select>
        </div>

        {/* 24x7 Quick Toggle Button */}
        <div className="md:col-span-2 flex flex-col justify-end">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Special Focus
          </label>
          <button
            type="button"
            onClick={handleToggle24x7}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              filters.is24x7 === 'true'
                ? 'bg-indigo-950 text-indigo-100 shadow-md ring-2 ring-indigo-500'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${filters.is24x7 === 'true' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>24×7 Day & Night</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Max Hourly Rate & Reset */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-600">Max Rate:</span>
          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={filters.maxPrice || 30}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            className="w-28 accent-brand-500 cursor-pointer"
          />
          <span className="font-bold text-slate-800">${filters.maxPrice || 30}/hr</span>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
