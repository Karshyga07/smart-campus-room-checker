import { describe, expect, it } from 'vitest';
import { checkAvailability } from '@/lib/bookingRules';
import type { Room } from '@/types';

const room: Room = {
  id: 'test-room',
  name: 'Test Room',
  code: 'T-101',
  building: 'Test Building',
  capacity: 20,
  equipment: ['projector'],
  blocked: false,
  bookings: [{ start: 600, end: 660, label: 'Existing class' }],
};

describe('checkAvailability', () => {
  it('rejects missing rooms and invalid interval bounds', () => {
    expect(checkAvailability(null, 600, 660, 540).verdict).toBe('unavailable');
    expect(checkAvailability(room, -1, 60, 0).reasons).toContain('Start time must be 0 or later.');
    expect(checkAvailability(room, 600, 1441, 0).reasons).toContain('End time must be 1440 (24:00) or earlier.');
    expect(checkAvailability(room, 660, 660, 0).reasons).toContain('Start time must be earlier than end time.');
  });

  it('rejects requests before the current time or over the duration limit', () => {
    expect(checkAvailability(room, 539, 599, 540).reasons).toContain(
      'Start time must be after the current time (09:00).'
    );
    expect(checkAvailability(room, 700, 821, 540).reasons).toContain(
      'Booking duration must not exceed 120 minutes.'
    );
  });

  it('rejects blocked rooms', () => {
    const blockedRoom = { ...room, blocked: true, blockedReason: 'Maintenance' };

    expect(checkAvailability(blockedRoom, 700, 760, 540).reasons).toContain('Room is blocked: Maintenance');
  });

  it('rejects overlapping bookings but allows touching endpoints', () => {
    expect(checkAvailability(room, 630, 690, 540).reasons).toContain(
      'Overlaps with "Existing class" (10:00–11:00).'
    );
    expect(checkAvailability(room, 660, 720, 540).verdict).toBe('available');
  });

  it('allows a request that satisfies every rule', () => {
    expect(checkAvailability(room, 720, 840, 540)).toEqual({ verdict: 'available', reasons: [] });
  });
});
