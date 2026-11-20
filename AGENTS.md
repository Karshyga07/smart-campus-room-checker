# AGENTS.md

## Project
Smart Campus room availability checker (React, TypeScript, Vite, Vitest).
Uses 6 fictional rooms and in-memory/mock data; no backend, no authentication/login, and no real booking creation.

## Architecture
- `src/types.ts` — domain interfaces (`Booking`, `Room`, `Verdict`, `CheckResult`).
- `src/data/rooms.ts` — fictional room fixtures (do not mutate in place).
- `src/lib/bookingRules.ts` — availability validation rules (`checkAvailability`, AC1–AC4).
- `src/lib/roomFilters.ts` — filtering helpers (`filterByCapacity`, `filterByEquipment`, `isRoomLocked`, `filterUnlocked`).
- `src/lib/availability.ts` — time/interval helpers (`overlaps`, `formatTime`, `minutesToTime`, `clamp`, `timeToMinutes`).
- `src/components/` — UI components (`Header.tsx`, `RoomSelector.tsx`, `BookingForm.tsx`, `ScheduleTimeline.tsx`).
- `src/App.tsx` — top-level application view and state wiring.

## Setup
- Install dependencies: `npm install`
- Do not commit secrets, `.env` credentials, or real personal/student data.

## Safe Commands
Run only read/check/build/test commands unless explicitly instructed otherwise:
- `npm test` (or `npm test -- --run`)
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run dev` (local development only)

## Coding Conventions & Constraints
- Preserve existing acceptance criteria (AC1–AC6 / project rules) and keep changes small, focused, and reversible.
- Prefer pure functions and immutable updates; never mutate room or booking fixtures.
- Keep UI feedback responsive and avoid introducing unnecessary abstractions or extra design patterns without clear justification.

## Verification
- Run existing tests, typecheck, lint, and build before and after edits.
- Add or update focused unit/regression tests when changing logic.
- Always report modified files, rationale, and actual command outputs (never fabricate results).

## Forbidden Actions
- **No secrets or sensitive data:** never read, log, hardcode, or commit API keys, tokens, credentials, or personal data.
- **No production deployments:** never run deployment commands or push/publish to production targets without explicit human approval.
- **No destructive commands:** never run destructive file/git deletions (`rm -rf`, `git reset --hard`, `git clean -fd`, force-push) unless explicitly requested.
- **No unreviewed dependency changes:** do not add, remove, or upgrade packages in `package.json` / lockfiles without explicit human approval.