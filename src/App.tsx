import { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import Header from '@/components/Header';
import BookingForm, { type FormState } from '@/components/BookingForm';
import RoomSelector from '@/components/RoomSelector';
import ScheduleTimeline from '@/components/ScheduleTimeline';
import { rooms } from '@/data/rooms';
import { timeToMinutes } from '@/lib/availability';
import { checkAvailability } from '@/lib/bookingRules';
import { filterByCapacity, filterByEquipment } from '@/lib/roomFilters';
import type { CheckResult } from '@/types';

const EQUIPMENT_OPTIONS = ['Projector', 'Whiteboard', 'Computers', 'Microphone'];

export default function App() {
  const [form, setForm] = useState<FormState>({
    roomId: 'r1',
    currentTime: '09:00',
    start: 600,
    end: 660,
  });
  const [result, setResult] = useState<CheckResult | null>(null);
  const [minCapacity, setMinCapacity] = useState(0);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  const matchingRooms = useMemo(
    () => filterByEquipment(filterByCapacity(rooms, minCapacity), requiredEquipment),
    [minCapacity, requiredEquipment]
  );

  const selectedRoom = useMemo(
    () => matchingRooms.find((r) => r.id === form.roomId) ?? null,
    [matchingRooms, form.roomId]
  );
  const currentTimeMin = timeToMinutes(form.currentTime);
  const candidate = form.start < form.end ? { start: form.start, end: form.end } : null;

  useEffect(() => {
    setResult(null);
  }, [form.roomId, form.currentTime, form.start, form.end, minCapacity, requiredEquipment]);

  const handleCheck = () => {
    setResult(checkAvailability(selectedRoom, form.start, form.end, currentTimeMin));
  };

  const toggleEquipment = (item: string) => {
    setRequiredEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Filters + Form + result */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Filter className="w-4 h-4 text-sky-600" /> Filter Rooms
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum Capacity</label>
                <input
                  type="number"
                  min={0}
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Required Equipment</label>
                <div className="grid grid-cols-2 gap-2">
                  {EQUIPMENT_OPTIONS.map((item) => {
                    const active = requiredEquipment.includes(item);
                    return (
                      <label
                        key={item}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                          active
                            ? 'border-sky-300 bg-sky-50 text-sky-700'
                            : 'border-gray-200 text-gray-700 hover:border-sky-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleEquipment(item)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {matchingRooms.length} {matchingRooms.length === 1 ? 'room' : 'rooms'} match
              </p>
            </div>

            {matchingRooms.length > 0 ? (
              <BookingForm
                rooms={matchingRooms}
                form={form}
                setForm={setForm}
                result={result}
                onCheck={handleCheck}
              />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                No rooms match
              </div>
            )}
          </div>

          {/* Right: Room info + schedule timeline */}
          <div className="lg:col-span-3 space-y-4">
            {matchingRooms.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                No rooms match
              </div>
            ) : selectedRoom ? (
              <>
                <RoomSelector room={selectedRoom} />
                <ScheduleTimeline
                  room={selectedRoom}
                  currentTime={currentTimeMin}
                  candidate={candidate}
                />
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-500 leading-relaxed">
                  <p className="font-semibold text-gray-700 mb-1.5">How validation works</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Interval must satisfy <code className="font-mono text-gray-700">0 ≤ start &lt; end ≤ 1440</code>.</li>
                    <li>Start must be after the current time you set.</li>
                    <li>Booking duration must not exceed 120 minutes.</li>
                    <li>Blocked rooms are always rejected.</li>
                    <li>Touching endpoints are allowed (e.g. 10:00–11:00 next to 11:00–12:00).</li>
                    <li>The existing booking data is never modified — this tool is read-only.</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                Select a room to view its schedule.
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
