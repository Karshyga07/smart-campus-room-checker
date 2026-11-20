import { describe, expect, it } from 'vitest';
import { checkAvailability } from '@/lib/bookingRules';
import { timeToMinutes } from '@/lib/availability';
import type { Room } from '@/types';

const baseRoom: Room = {
  id: 'r1',
  name: 'Lecture Hall 101',
  code: 'LH-101',
  building: 'Main',
  capacity: 40,
  equipment: ['Projector'],
  blocked: false,
  bookings: [{ start: 600, end: 660, label: 'Math Lecture' }],
};

describe('checkAvailability', () => {
  it('allows valid non-overlapping slot within 120 min limit', () => {
    const res = checkAvailability(baseRoom, 660, 720, 540);
    expect(res.verdict).toBe('available');
    expect(res.reasons).toHaveLength(0);
  });

  it('rejects duration over 120 minutes', () => {
    const res = checkAvailability(baseRoom, 660, 785, 540);
    expect(res.verdict).toBe('unavailable');
  });

  it('rejects blocked room and null room', () => {
    expect(checkAvailability(null, 660, 720, 540).verdict).toBe('unavailable');
    expect(checkAvailability({ ...baseRoom, blocked: true, blockedReason: 'Maintenance' }, 660, 720, 540).verdict).toBe('unavailable');
  });
});

describe('timeToMinutes validation', () => {
  it('parses valid HH:MM and rejects invalid minutes/format', () => {
    expect(timeToMinutes('09:30')).toBe(570);
    expect(Number.isNaN(timeToMinutes('09:75'))).toBe(true);
    expect(Number.isNaN(timeToMinutes('0930'))).toBe(true);
  });
});