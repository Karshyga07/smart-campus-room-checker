import type { Room } from '@/types';

const normalize = (s: string): string => s.trim().toLowerCase();

/** Rooms that seat at least `minCapacity` people (capacity >= requested). */
export function filterByCapacity(rooms: readonly Room[], minCapacity: number): Room[] {
  if (!Number.isFinite(minCapacity)) return [];
  return rooms.filter((room) => room.capacity >= minCapacity);
}

/**
 * Rooms that have ALL of the required equipment (case-insensitive).
 * An empty requirement list matches every room.
 */
export function filterByEquipment(rooms: readonly Room[], required: readonly string[]): Room[] {
  const needed = required.map(normalize).filter(Boolean);
  return rooms.filter((room) => {
    const have = new Set(room.equipment.map(normalize));
    return needed.every((item) => have.has(item));
  });
}

/** A locked (blocked) room is never available for booking. */
export function isRoomLocked(room: Room): boolean {
  return room.blocked;
}

/** Keeps only rooms that are not locked. */
export function filterUnlocked(rooms: readonly Room[]): Room[] {
  return rooms.filter((room) => !isRoomLocked(room));
}