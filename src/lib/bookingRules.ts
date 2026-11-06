import type { CheckResult, Room } from '@/types';
import { formatTime, overlaps } from '@/lib/availability';

export function checkAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number
): CheckResult {
  const reasons: string[] = [];

  if (!room) {
    return { verdict: 'unavailable', reasons: ['Please select a room first.'] };
  }

  // AC1: 0 <= start < end <= 1440 and start must be after currentTime
  if (start < 0) {
    reasons.push('Start time must be 0 or later.');
  }
  if (end > 1440) {
    reasons.push('End time must be 1440 (24:00) or earlier.');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start < currentTime) {
    reasons.push(`Start time must be after the current time (${formatTime(currentTime)}).`);
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > 120) {
    reasons.push('Booking duration must not exceed 120 minutes.');
  }

  // AC3: reject when the room is blocked
  if (room.blocked) {
    reasons.push(`Room is blocked: ${room.blockedReason ?? 'unavailable for bookings.'}`);
  }

  // AC4: reject overlapping intervals (touching endpoints are allowed)
  const conflict = room.bookings.find((booking) => overlaps(start, end, booking.start, booking.end));
  if (conflict) {
    reasons.push(`Overlaps with "${conflict.label}" (${formatTime(conflict.start)}–${formatTime(conflict.end)}).`);
  }

  return {
    verdict: reasons.length === 0 ? 'available' : 'unavailable',
    reasons,
  };
}
