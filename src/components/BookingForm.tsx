import { Clock, ChevronRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { clamp, minutesToTime, timeToMinutes } from '@/lib/availability';
import type { Room, CheckResult } from '@/types';

export interface FormState {
  roomId: string;
  currentTime: string; // HH:MM
  start: number; // minutes
  end: number; // minutes
}

interface Props {
  rooms: Room[];
  form: FormState;
  setForm: (f: FormState) => void;
  result: CheckResult | null;
  onCheck: () => void;
}

const quickPresets = [
  { label: '30 min', duration: 30 },
  { label: '60 min', duration: 60 },
  { label: '90 min', duration: 90 },
  { label: '120 min', duration: 120 },
];

export default function BookingForm({ rooms, form, setForm, result, onCheck }: Props) {
  const selectedRoom = rooms.find((r) => r.id === form.roomId) ?? null;
  const duration = form.end - form.start;
  const startAfterCurrent = form.start >= timeToMinutes(form.currentTime);
  const validRange = form.start >= 0 && form.end <= 1440 && form.start < form.end;

  const updateStart = (raw: number) => {
    setForm({ ...form, start: clamp(raw, 0, 1440), end: Math.max(raw + 30, form.end) });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Clock className="w-4 h-4 text-sky-600" /> Check Room Availability
      </div>

      {/* Room select */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Room</label>
        <select
          value={form.roomId}
          onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">— Choose a room —</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.code}){r.blocked ? ' — Blocked' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Current time */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Current Time <span className="text-gray-400 font-normal">(the "now" for validation)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={form.currentTime}
            onChange={(e) => setForm({ ...form, currentTime: e.target.value })}
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              setForm({ ...form, currentTime: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
            }}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium whitespace-nowrap"
          >
            Use real now
          </button>
        </div>
      </div>

      {/* Start & End inputs — both minutes and time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Start</label>
          <input
            type="time"
            value={minutesToTime(form.start)}
            onChange={(e) => updateStart(timeToMinutes(e.target.value))}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
          <input
            type="number"
            min={0}
            max={1440}
            value={form.start}
            onChange={(e) => updateStart(Number(e.target.value))}
            className="w-full mt-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-gray-600"
          />
          <p className="text-[10px] text-gray-400 mt-1">minutes (0–1440)</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">End</label>
          <input
            type="time"
            value={minutesToTime(form.end)}
            onChange={(e) => setForm({ ...form, end: clamp(Number(timeToMinutes(e.target.value)), 0, 1440) })}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
          <input
            type="number"
            min={0}
            max={1440}
            value={form.end}
            onChange={(e) => setForm({ ...form, end: clamp(Number(e.target.value), 0, 1440) })}
            className="w-full mt-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-gray-600"
          />
          <p className="text-[10px] text-gray-400 mt-1">minutes (0–1440)</p>
        </div>
      </div>

      {/* Duration hint */}
      <div className="flex items-center justify-between text-xs">
        <span className={duration > 120 ? 'text-rose-600 font-medium' : 'text-gray-500'}>
          Duration: {duration > 0 ? `${duration} min` : '—'}
          {duration > 120 && ' (exceeds 120 min max)'}
        </span>
        <div className="flex gap-1">
          {quickPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setForm({ ...form, end: form.start + p.duration })}
              className="px-2 py-1 text-[10px] rounded-md border border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inline validation hints */}
      {selectedRoom && (
        <div className="space-y-1">
          {!startAfterCurrent && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Start must be after current time ({form.currentTime}).
            </p>
          )}
          {!validRange && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Interval must satisfy 0 ≤ start &lt; end ≤ 1440.
            </p>
          )}
          {selectedRoom.blocked && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> This room is blocked: {selectedRoom.blockedReason}
            </p>
          )}
        </div>
      )}

      {/* Check button */}
      <button
        onClick={onCheck}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
      >
        Check Availability <ChevronRight className="w-4 h-4" />
      </button>

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-3.5 border animate-[fadeIn_0.2s_ease] ${
          result.verdict === 'available'
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {result.verdict === 'available'
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              : <XCircle className="w-5 h-5 text-rose-600" />
            }
            <span className={`font-semibold text-sm ${result.verdict === 'available' ? 'text-emerald-700' : 'text-rose-700'}`}>
              {result.verdict === 'available' ? 'Available — booking is allowed' : 'Unavailable'}
            </span>
          </div>
          {result.reasons.length > 0 && (
            <ul className="space-y-1 mt-2">
              {result.reasons.map((r, i) => (
                <li key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" /> {r}
                </li>
              ))}
            </ul>
          )}
          {result.verdict === 'available' && (
            <p className="text-xs text-emerald-600 mt-1">
              The requested time slot does not overlap any existing booking and satisfies all rules.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
