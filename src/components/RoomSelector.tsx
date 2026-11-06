import { MapPin, Users, AlertTriangle } from 'lucide-react';
import type { Room } from '@/types';

interface Props {
  room: Room;
}

export default function RoomSelector({ room }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
        <span className="text-xs font-mono font-semibold text-sky-700">{room.code}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm text-gray-900 truncate">{room.name}</div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="inline-flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {room.building}</span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-0.5"><Users className="w-3 h-3" /> {room.capacity}</span>
        </div>
      </div>
      {room.blocked && (
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" /> Blocked
        </span>
      )}
    </div>
  );
}
