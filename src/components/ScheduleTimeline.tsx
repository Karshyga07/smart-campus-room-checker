import { formatTime } from '@/lib/availability';
import type { Room } from '@/types';

interface TimelineProps {
  room: Room;
  currentTime: number;
  candidate: { start: number; end: number } | null;
}

export default function ScheduleTimeline({ room, currentTime, candidate }: TimelineProps) {
  const PX_PER_MIN = 0.5;
  const width = (min: number) => min * PX_PER_MIN;
  const totalWidth = width(1440);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Today's Schedule — {room.name}</h3>
        <span className="text-xs text-gray-400 font-mono">{room.code}</span>
      </div>

      {/* Track */}
      <div className="relative overflow-x-auto pb-2">
        <div className="relative" style={{ width: totalWidth, minWidth: '100%' }}>
          {/* Hour gridlines + labels */}
          <div className="flex h-5 mb-1 relative" style={{ width: totalWidth }}>
            {Array.from({ length: 25 }, (_, h) => (
              <div key={h} className="absolute text-[9px] text-gray-400" style={{ left: width(h * 60) }}>
                {String(h).padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Track bar */}
          <div className="relative h-10 bg-gray-50 rounded-md border border-gray-200" style={{ width: totalWidth }}>
            {/* Bookings */}
            {room.bookings.map((b, i) => (
              <div
                key={i}
                className="absolute top-1 bottom-1 rounded bg-sky-200/70 border border-sky-300 flex items-center justify-start px-1.5 overflow-hidden"
                style={{ left: width(b.start), width: width(b.end - b.start) }}
                title={`${b.label} (${formatTime(b.start)}–${formatTime(b.end)})`}
              >
                <span className="text-[10px] text-sky-900 font-medium whitespace-nowrap truncate">{b.label}</span>
              </div>
            ))}

            {/* Blocked overlay */}
            {room.blocked && (
              <div className="absolute inset-0 bg-amber-100/60 flex items-center justify-center rounded-md">
                <span className="text-xs font-semibold text-amber-700">Room Blocked</span>
              </div>
            )}

            {/* Candidate interval */}
            {candidate && candidate.start < candidate.end && !room.blocked && (
              <div
                className="absolute top-0 bottom-0 border-2 border-dashed border-emerald-500 bg-emerald-100/40 rounded"
                style={{ left: width(candidate.start), width: width(candidate.end - candidate.start) }}
              />
            )}

            {/* Current time marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-gray-900 z-10" style={{ left: width(currentTime) }} />
            <div
              className="absolute text-[9px] font-mono text-gray-900 bg-white px-0.5 rounded shadow-sm -top-4"
              style={{ left: width(currentTime) - 12 }}
            >
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-200/70 border border-sky-300" /> Existing booking
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-dashed border-emerald-500 bg-emerald-100/40" /> Your request
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-0.5 h-3 bg-gray-900" /> Current time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
