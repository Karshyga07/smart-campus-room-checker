import { Building2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-md bg-white/90">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Campus Room Checker</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Verify a booking slot against room schedules</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-200">
          <Clock className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="font-mono font-semibold text-sm text-gray-900 tabular-nums">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </header>
  );
}
