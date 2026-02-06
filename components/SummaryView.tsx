
import React from 'react';
import { Summary } from '../types';

interface SummaryViewProps {
  summary: Summary;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center space-x-2 mb-4">
        <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        <h3 className="font-bold text-slate-800">Key Takeaways</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-slate-700 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1 bg-emerald-50/50 rounded-r-lg">
          "{summary.mainPoint}"
        </p>
      </div>

      <div className="space-y-3">
        {summary.takeaways.map((point, idx) => (
          <div key={idx} className="flex items-start">
            <span className="text-emerald-500 mr-2 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-sm text-slate-600">{point}</p>
          </div>
        ))}
      </div>

      {summary.context && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
          Context: {summary.context}
        </div>
      )}
    </div>
  );
};

export default SummaryView;
