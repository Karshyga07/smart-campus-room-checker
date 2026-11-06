export interface Booking {
  start: number; // minutes from midnight
  end: number;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean; // lock status
  blockedReason?: string;
  bookings: Booking[]; // this room's own reservations
}

export type Verdict = 'available' | 'unavailable';

export interface CheckResult {
  verdict: Verdict;
  reasons: string[];
}