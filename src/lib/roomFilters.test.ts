import { describe, it, expect } from 'vitest';
import { filterByCapacity, filterByEquipment, isRoomLocked } from './roomFilters';
import type { Room } from '../types';

describe('Room Filters', () => {
  const mockRooms: Room[] = [
    { id: '1', name: 'Room A', code: 'A-1', building: 'Bldg A', capacity: 10, equipment: ['Projector'], blocked: false, bookings: [] },
    { id: '2', name: 'Room B', code: 'B-1', building: 'Bldg B', capacity: 20, equipment: ['Projector', 'Whiteboard'], blocked: false, bookings: [] },
    { id: '3', name: 'Room C', code: 'C-1', building: 'Bldg C', capacity: 5, equipment: [], blocked: true, bookings: [] },
  ];

  it('filters rooms by capacity correctly (F1)', () => {
    const result = filterByCapacity(mockRooms, 15);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters rooms by required equipment correctly (F2)', () => {
    const result = filterByEquipment(mockRooms, ['Whiteboard']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('identifies blocked rooms correctly (F3)', () => {
    expect(isRoomLocked(mockRooms[2])).toBe(true);
    expect(isRoomLocked(mockRooms[0])).toBe(false);
  });
  it('returns empty array if minimum capacity exceeds all rooms', () => {
    const result = filterByCapacity(mockRooms, 100);
    expect(result).toHaveLength(0);
  });

  it('matches all rooms if required equipment list is empty', () => {
    const result = filterByEquipment(mockRooms, []);
    expect(result).toHaveLength(mockRooms.length);
  });
});