# Smart Campus Room Availability Checker

## Setup
npm install

## Run
npm run dev

## Test
npm test

## Other checks
npm run typecheck
npm run build

## Structure
- src/data/rooms.ts — 6 fictional rooms
- src/lib/bookingRules.ts — validateInterval, checkAvailability (AC1–AC5)
- src/lib/roomFilters.ts — capacity and equipment filters (F1–F2)
- src/lib/availability.ts — time helpers
- src/components — UI only
