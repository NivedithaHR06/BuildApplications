
import React from 'react';
import { StudyPlan } from '../types';

interface StudyPlanViewProps {
  plan: StudyPlan;
}

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ plan }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        {plan.title}
      </h3>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-slate-100">
        {plan.items.map((item, idx) => (
          <div key={idx} className="relative pl-12">
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10">
              <span className="text-xs font-bold text-indigo-600">{idx + 1}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{item.topic}</h4>
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {item.duration}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{item.description}</p>
              {item.resources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.resources.map((res, ridx) => (
                    <span key={ridx} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500">
                      #{res}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanView;
