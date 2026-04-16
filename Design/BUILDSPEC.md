# Death Fields Arena — Army Builder: Full Build Document
**Version 1.0 | Project DFA | 2026**
*The Greatest Sport is War*

| Field | Value |
|-------|-------|
| Document Status | DRAFT — Internal |
| Owner | Project DFA Team |
| Last Updated | 2026 |
| Platforms | Web (React) → Android (React Native) → iOS (React Native) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Repo | github.com/Sebgedge87/Project-DFA |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication](#5-authentication)
6. [Army Builder — Business Logic](#6-army-builder--business-logic)
7. [API Layer](#7-api-layer)
8. [Responsive Design & Navigation](#8-responsive-design--navigation)
9. [UI Component Design](#9-ui-component-design)
10. [Sharing & External Links](#10-sharing--external-links)
11. [Build & Deployment](#11-build--deployment)
12. [Game Data — Seed Strategy](#12-game-data--seed-strategy)
13. [Phased Delivery Plan](#13-phased-delivery-plan)
14. [Open Questions & Decisions Required](#14-open-questions--decisions-required)

---

## 1. Project Overview

The Death Fields Arena Army Builder is a cross-platform application allowing players of the Death Fields Arena tabletop skirmish game (by Wargames Atlantic) to construct, save, share, and manage army lists. The app enforces the game's 1,000-point team limit, displays complete unit rules on demand, and provides links to official product pages for miniature purchase.

### 1.1 Goals

- Allow registered users to build and save multiple army lists per faction
- Surface unit stat cards, abilities, and weapon profiles inline without leaving the builder
- Enforce faction rules: 1 Captain required, Specialist limits, 1,000pt cap
- Generate a shareable link and printable list for every army
- Link each faction and unit to the Wargames Atlantic store
- Deliver a 100% responsive experience across phone, tablet, and desktop
- Launch web first; ship Android and iOS via React Native using shared code

### 1.2 Non-Goals (v1)

- No campaign tracking or match history in v1
- No in-app purchases or payment processing
- No real-time multiplayer or live opponent matching
- No custom unit creation — only official rosters

---

## 2. Tech Stack

Every technology choice is made to maximise code reuse across web and mobile while keeping the stack approachable for a small team. The guiding principle is: **write business logic once, render it everywhere.**

### 2.1 Frontend — Web

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18+ | Component model maps perfectly to unit cards, army lists, faction pages |
| Build tool | Vite | 5+ | Fast HMR, native ESM, minimal config |
| Language | TypeScript | 5+ | Type-safety across shared models and API calls |
| Routing | React Router v6 | 6+ | File-based routing; nested layouts for faction → unit drill-down |
| State mgmt | Zustand | 4+ | Lightweight global store for army list, user session, UI state |
| Styling | Tailwind CSS | 3+ | Utility-first; responsive breakpoints built-in; no CSS-in-JS overhead |
| UI kit | Radix UI (headless) | Latest | Accessible primitives — dialogs, tooltips, dropdowns — zero style lock-in |
| Animations | Framer Motion | 11+ | Unit card reveals, list transitions, page animations |
| Forms | React Hook Form + Zod | Latest | Schema-driven validation for list names, share settings |
| HTTP | TanStack Query v5 | 5+ | Server state, caching, optimistic updates for army list mutations |
| Icons | Lucide React | Latest | Consistent icon set; tree-shakeable |
| PDF export | react-pdf / jsPDF | Latest | Client-side army list PDF generation for printing |

### 2.2 Frontend — Mobile (React Native)

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React Native (Expo) | SDK 51+ | Expo managed workflow — OTA updates, no Xcode/Android Studio for dev |
| Language | TypeScript | 5+ | Shared types with web codebase |
| Navigation | React Navigation v6 | 6+ | Stack + Bottom Tabs; drawer for tablet |
| Styling | NativeWind | 4+ | Tailwind syntax over StyleSheet — near-identical class names to web |
| State mgmt | Zustand (shared) | 4+ | Same stores as web; platform-specific adapters where needed |
| HTTP | TanStack Query (shared) | 5+ | Same hooks as web |
| Auth | Expo AuthSession | Latest | OAuth deep-links for Google/Apple/Discord |
| Storage | expo-secure-store | Latest | JWT + refresh token persistence |
| Haptics | expo-haptics | Latest | Tactile feedback on unit add/remove |
| Sharing | expo-sharing | Latest | Share army list via native share sheet |

### 2.3 Backend — Supabase

Supabase is an open-source Firebase alternative built on PostgreSQL. It provides the entire backend stack from a single managed service, eliminating the need to operate separate auth, database, and storage infrastructure.

| Service | Purpose | Notes |
|---------|---------|-------|
| PostgreSQL 15 | Primary database — all game data and user data | Row-Level Security (RLS) enforces per-user data access at DB layer |
| Supabase Auth | OAuth + magic-link authentication | Providers: Google, Discord, Apple (required for iOS App Store) |
| Supabase Storage | Unit images, faction art, rulebook assets | CDN-backed; public bucket for game assets, private for user avatars |
| Supabase Realtime | Live sync for collaborative list editing (v2) | Postgres CDC broadcasts changes via websocket |
| Edge Functions | Share-link resolution, PDF generation hook | Deno runtime; deployed globally on Supabase infra |
| PostgREST | Auto-generated REST API from DB schema | All CRUD over HTTPS; used by TanStack Query on client |

### 2.4 Infrastructure & Tooling

| Tool | Purpose | Notes |
|------|---------|-------|
| Vercel | Web app hosting + preview deployments | Automatic deploys on main; per-PR preview URLs |
| Expo EAS | React Native cloud builds + OTA updates | Android APK/AAB and iOS IPA built in CI |
| GitHub Actions | CI/CD pipeline | Lint → type-check → test → deploy on push |
| Playwright | E2E testing (web) | Critical user flows: auth, list build, share |
| Vitest | Unit + integration tests | Component tests, store tests, Supabase mock |
| ESLint + Prettier | Code quality + formatting | Shared config across web and mobile workspaces |
| Turborepo | Monorepo task orchestration | Parallel builds; shared packages; incremental caching |
| Sentry | Error monitoring (web + mobile) | Session replay on web; crash reports on mobile |
| PostHog | Product analytics | Self-hostable; GDPR-compliant; feature flags for phased rollout |

---

## 3. Repository Structure

The project is a Turborepo monorepo. All packages live under one repository, sharing TypeScript types, business logic, and Supabase client configuration.

```
Project-DFA/
├── apps/
│   ├── web/                    # React + Vite web application
│   │   ├── src/
│   │   │   ├── pages/          # Route-level components
│   │   │   │   ├── index.tsx           # Landing / faction selector
│   │   │   │   ├── builder/[faction].tsx  # Army builder
│   │   │   │   ├── list/[id].tsx       # Saved list view
│   │   │   │   ├── share/[token].tsx   # Public share view
│   │   │   │   ├── profile.tsx         # User profile + lists
│   │   │   │   └── auth/               # Login / OAuth callback
│   │   │   ├── components/
│   │   │   │   ├── layout/     # AppShell, Sidebar, BottomNav
│   │   │   │   ├── faction/    # FactionCard, FactionGrid
│   │   │   │   ├── unit/       # UnitCard, StatBlock, AbilityList
│   │   │   │   ├── builder/    # ArmyList, PointsBar, UnitPicker
│   │   │   │   └── ui/         # Shared primitives (Button, Modal…)
│   │   │   ├── stores/         # Zustand stores
│   │   │   │   ├── armyStore.ts
│   │   │   │   ├── authStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   ├── hooks/          # TanStack Query hooks
│   │   │   └── lib/            # Supabase client, constants
│   │   └── public/             # Static assets
│   │
│   └── mobile/                 # Expo React Native application
│       ├── app/                # Expo Router file-based routes
│       │   ├── (tabs)/
│       │   │   ├── index.tsx   # Faction selector
│       │   │   ├── lists.tsx   # My army lists
│       │   │   └── profile.tsx
│       │   ├── builder/[faction].tsx
│       │   └── share/[token].tsx
│       ├── components/         # Native-specific components
│       └── lib/                # Platform adapters
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   └── src/
│   │       ├── database.ts     # Supabase generated DB types
│   │       ├── models.ts       # Domain models (Faction, Unit…)
│   │       └── api.ts          # API request/response types
│   │
│   ├── logic/                  # Platform-agnostic business logic
│   │   └── src/
│   │       ├── army/           # Point calculation, validation
│   │       ├── roster/         # Unit eligibility, limits
│   │       └── share/          # Share token generation
│   │
│   └── supabase-client/        # Configured Supabase client
│       └── src/
│           ├── client.ts
│           └── queries/        # Shared query functions
│
├── supabase/
│   ├── migrations/             # SQL migration files
│   ├── seed/                   # Game data seed scripts
│   ├── functions/              # Edge Functions
│   │   ├── resolve-share/      # Share token → list data
│   │   └── export-pdf/         # Server-side PDF generation
│   └── config.toml
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, test, type-check
│       ├── deploy-web.yml      # Vercel deploy on main
│       └── build-mobile.yml    # EAS build on tag
│
├── turbo.json
├── package.json                # Root workspace
└── README.md
```

---

## 4. Database Schema

All tables live in a Supabase-managed PostgreSQL 15 instance. Row-Level Security (RLS) policies ensure users can only read/write their own data. Game data tables (factions, unit_types, weapons) are publicly readable and seeded once at project setup.

### 4.1 Entity Relationship Summary

| Table | Description | RLS |
|-------|-------------|-----|
| profiles | One-to-one with auth.users; display name, avatar, preferences | User can read/write own row |
| factions | Les Grognards, Bulldogs, Einherjar etc. — static game data | Public read; admin write |
| unit_types | Every unit on every roster sheet with full stat block | Public read; admin write |
| weapons | Weapon profiles (range, attacks, damage, AP, keywords) | Public read; admin write |
| unit_weapons | Join table linking unit_types to their weapons | Public read; admin write |
| army_lists | A named, user-owned army list for a specific faction | Owner read/write; public if is_public=true |
| army_entries | Line items inside an army list: unit_type + quantity | Inherit from parent army_list |
| keywords | Normalised keyword definitions (Slow, Blast, Mobile…) | Public read; admin write |
| unit_keywords | Join table linking weapons/units to keywords | Public read; admin write |

### 4.2 SQL Schema

```sql
-- ── PROFILES ─────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text,
  avatar_url    text,
  bio           text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── FACTIONS ──────────────────────────────────────────────────────
create table public.factions (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,   -- 'bulldogs', 'les-grognards'
  name          text not null,
  tagline       text,
  lore          text,
  color_primary text not null,          -- hex without #
  color_accent  text not null,
  image_url     text,                   -- faction hero art
  store_url     text,                   -- wargamesatlantic.com product
  rulebook_url  text,                   -- PDF or page link
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── UNIT ROLES ENUM ───────────────────────────────────────────────
create type unit_role as enum ('captain', 'specialist', 'core');

-- ── UNIT TYPES ────────────────────────────────────────────────────
create table public.unit_types (
  id            uuid primary key default gen_random_uuid(),
  faction_id    uuid not null references factions(id),
  name          text not null,
  role          unit_role not null,
  actions       int not null,
  movement      int not null,
  melee_attack  int not null,
  ranged_attack int not null,
  defence       int not null,
  health        int not null,
  points        int not null,
  max_per_army  int,                    -- null = unlimited
  abilities     jsonb default '[]',     -- [{name, description}]
  image_url     text,
  base_size_mm  int default 25,
  store_url     text,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── WEAPONS ───────────────────────────────────────────────────────
create table public.weapons (
  id              uuid primary key default gen_random_uuid(),
  faction_id      uuid references factions(id),  -- null = universal
  name            text not null,
  range_inches    text,                  -- 'Melee', '20"', 'Template'
  num_attacks     int not null,
  damage          text not null,         -- '1', '2', 'd5'
  defence_mod     int default 0,         -- negative = AP
  notes           text,
  created_at      timestamptz default now()
);

-- ── UNIT → WEAPONS JOIN ────────────────────────────────────────────
create table public.unit_weapons (
  unit_type_id  uuid not null references unit_types(id) on delete cascade,
  weapon_id     uuid not null references weapons(id) on delete cascade,
  primary key (unit_type_id, weapon_id)
);

-- ── KEYWORDS ──────────────────────────────────────────────────────
create table public.keywords (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,
  description   text not null
);

-- ── WEAPON → KEYWORDS JOIN ─────────────────────────────────────────
create table public.weapon_keywords (
  weapon_id   uuid not null references weapons(id) on delete cascade,
  keyword_id  uuid not null references keywords(id) on delete cascade,
  parameter   text,   -- e.g. '3' for Blast(3)
  primary key (weapon_id, keyword_id)
);

-- ── ARMY LISTS ────────────────────────────────────────────────────
create table public.army_lists (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  faction_id    uuid not null references factions(id),
  name          text not null default 'My Army',
  notes         text,
  points_total  int not null default 0,
  is_public     boolean not null default false,
  share_token   text unique default encode(gen_random_bytes(12), 'base64url'),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── ARMY ENTRIES ──────────────────────────────────────────────────
create table public.army_entries (
  id            uuid primary key default gen_random_uuid(),
  army_list_id  uuid not null references army_lists(id) on delete cascade,
  unit_type_id  uuid not null references unit_types(id),
  quantity      int not null default 1 check (quantity >= 1)
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
alter table profiles     enable row level security;
alter table army_lists   enable row level security;
alter table army_entries enable row level security;

create policy 'Own profile' on profiles
  for all using (auth.uid() = id);

create policy 'Own lists' on army_lists
  for all using (auth.uid() = user_id);

create policy 'Public lists readable' on army_lists
  for select using (is_public = true);

create policy 'Own entries via list' on army_entries
  for all using (
    army_list_id in (
      select id from army_lists where user_id = auth.uid()
    )
  );

-- ── INDEXES ───────────────────────────────────────────────────────
create index on unit_types (faction_id);
create index on army_lists (user_id);
create index on army_lists (share_token);
create index on army_entries (army_list_id);
```

---

## 5. Authentication

Authentication is handled entirely by Supabase Auth, which issues JWTs consumed by both the frontend and PostgREST. OAuth providers are configured in the Supabase dashboard and require no custom auth server.

### 5.1 OAuth Providers

| Provider | Web | Android | iOS | Notes |
|----------|-----|---------|-----|-------|
| Google | ✓ | ✓ | ✓ | Recommended primary; widely used |
| Discord | ✓ | ✓ | ✓ | Highly relevant to the tabletop gaming audience |
| Apple | — | Optional | ✓ Required | Apple mandates Sign in with Apple for any app using other OAuth on iOS |
| Magic Link | ✓ | ✓ | ✓ | Email fallback; no provider account needed |

### 5.2 Auth Flow

1. User taps Login button
2. OAuth provider redirect (PKCE flow)
3. Supabase exchanges code for session (access + refresh token)
4. Client stores tokens (localStorage on web; expo-secure-store on mobile)
5. Supabase client attaches Bearer token to all PostgREST requests automatically
6. RLS policies on DB evaluate `auth.uid()` per request

> **Note:** On first OAuth sign-in, a database trigger creates a matching row in `public.profiles` with the user's name and avatar from the provider.

---

## 6. Army Builder — Business Logic

All validation logic lives in `packages/logic` so it is shared identically between web and mobile. The Zustand army store calls these functions before committing any mutation.

### 6.1 Validation Rules

| Rule | Condition | Error Message |
|------|-----------|---------------|
| Points cap | Sum of (unit.points × quantity) ≤ 1000 | Army exceeds 1,000 point limit |
| Captain required | Exactly 1 Captain per army list | Every army must include one Captain |
| Captain limit | No more than 1 Captain may be added | Only one Captain is allowed per army |
| Specialist limit | Total Specialist slots ≤ 4 | Maximum of 4 Specialist slots per army |
| Unit max_per_army | unit.quantity ≤ unit_type.max_per_army (if set) | Maximum {n} of this unit type allowed |
| Minimum models | Total model count ≥ 5 | Army must contain at least 5 models |
| Faction lock | All entries share same faction_id | All units must belong to the same faction |

### 6.2 Points Calculation

```typescript
// packages/logic/src/army/points.ts

export const POINTS_LIMIT = 1000;

export function calculatePoints(entries: ArmyEntry[]): number {
  return entries.reduce((total, entry) => {
    return total + (entry.unit_type.points * entry.quantity);
  }, 0);
}

export function remainingPoints(entries: ArmyEntry[]): number {
  return POINTS_LIMIT - calculatePoints(entries);
}

export function isOverPoints(entries: ArmyEntry[]): boolean {
  return calculatePoints(entries) > POINTS_LIMIT;
}
```

### 6.3 Validation Function

```typescript
// packages/logic/src/army/validate.ts

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateAddUnit(
  entries: ArmyEntry[],
  unit: UnitType
): ValidationResult {
  // Points cap
  const projected = calculatePoints(entries) + unit.points;
  if (projected > POINTS_LIMIT)
    return { ok: false, error: 'Army exceeds 1,000 point limit' };

  // Captain limit
  if (unit.role === 'captain') {
    const hasCaptain = entries.some(e => e.unit_type.role === 'captain');
    if (hasCaptain)
      return { ok: false, error: 'Only one Captain is allowed per army' };
  }

  // Specialist limit (max 4 slots)
  if (unit.role === 'specialist') {
    const specialistCount = entries
      .filter(e => e.unit_type.role === 'specialist')
      .reduce((sum, e) => sum + e.quantity, 0);
    if (specialistCount >= 4)
      return { ok: false, error: 'Maximum of 4 Specialist slots per army' };
  }

  // Per-unit cap
  if (unit.max_per_army !== null) {
    const existing = entries.find(e => e.unit_type.id === unit.id);
    const currentQty = existing?.quantity ?? 0;
    if (currentQty >= unit.max_per_army)
      return { ok: false, error: `Maximum ${unit.max_per_army} of this unit type allowed` };
  }

  return { ok: true };
}
```

### 6.4 Zustand Army Store

```typescript
// apps/web/src/stores/armyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateAddUnit, calculatePoints } from '@dfa/logic';

interface ArmyState {
  listId:       string | null;
  listName:     string;
  faction:      Faction | null;
  entries:      ArmyEntry[];
  isDirty:      boolean;
  setFaction:   (faction: Faction) => void;
  addUnit:      (unit: UnitType) => ValidationResult;
  removeUnit:   (entryId: string) => void;
  setQuantity:  (entryId: string, qty: number) => void;
  setName:      (name: string) => void;
  saveList:     () => Promise<void>;
  loadList:     (id: string) => Promise<void>;
  resetArmy:    () => void;
}

export const useArmyStore = create<ArmyState>()(
  persist(
    (set, get) => ({
      listId:    null,
      listName:  'My Army',
      faction:   null,
      entries:   [],
      isDirty:   false,

      setFaction: (faction) => set({ faction, entries: [], isDirty: false }),

      addUnit: (unit) => {
        const result = validateAddUnit(get().entries, unit);
        if (result.ok) {
          set(s => {
            const existing = s.entries.find(e => e.unit_type.id === unit.id);
            if (existing) {
              return {
                entries: s.entries.map(e =>
                  e.unit_type.id === unit.id
                    ? { ...e, quantity: e.quantity + 1 }
                    : e
                ),
                isDirty: true,
              };
            }
            return {
              entries: [...s.entries, { id: crypto.randomUUID(), unit_type: unit, quantity: 1 }],
              isDirty: true,
            };
          });
        }
        return result;
      },

      removeUnit: (entryId) =>
        set(s => ({ entries: s.entries.filter(e => e.id !== entryId), isDirty: true })),

      setQuantity: (entryId, qty) =>
        set(s => ({
          entries: qty <= 0
            ? s.entries.filter(e => e.id !== entryId)
            : s.entries.map(e => e.id === entryId ? { ...e, quantity: qty } : e),
          isDirty: true,
        })),

      setName: (name) => set({ listName: name, isDirty: true }),

      saveList: async () => {
        const { listId, listName, faction, entries } = get();
        const { data: list } = await supabase
          .from('army_lists')
          .upsert({ id: listId ?? undefined, name: listName, faction_id: faction!.id, points_total: calculatePoints(entries) })
          .select()
          .single();
        // replace entries
        await supabase.from('army_entries').delete().eq('army_list_id', list.id);
        await supabase.from('army_entries').insert(
          entries.map(e => ({ army_list_id: list.id, unit_type_id: e.unit_type.id, quantity: e.quantity }))
        );
        set({ listId: list.id, isDirty: false });
      },

      resetArmy: () => set({ listId: null, listName: 'My Army', faction: null, entries: [], isDirty: false }),
    }),
    { name: 'dfa-army-draft' }  // persists draft to localStorage
  )
);
```

---

## 7. API Layer

There is no custom REST API server. The Supabase PostgREST API is the data API. All client-side data fetching uses TanStack Query hooks that call the Supabase JavaScript client directly. Edge Functions handle the two server-side operations that need logic beyond simple CRUD.

### 7.1 Key Query Hooks

| Hook | Description | Supabase Call |
|------|-------------|---------------|
| `useFactions()` | Fetch all factions ordered by sort_order | `.from('factions').select('*').order('sort_order')` |
| `useUnitTypes(factionId)` | Fetch all units for a faction, weapons joined | `.from('unit_types').select('*, unit_weapons(weapon:weapons(*))')` |
| `useMyLists()` | Fetch authenticated user's army lists | `.from('army_lists').select('*').eq('user_id', uid)` |
| `useList(id)` | Fetch single list with all entries and unit details | `.from('army_lists').select('*, army_entries(*, unit_type:unit_types(*))')` |
| `useShareList(token)` | Fetch public list by share token | `.from('army_lists').select('...').eq('share_token', token).eq('is_public', true)` |
| `useSaveList()` | Mutation: upsert army_list + replace army_entries | POST/PATCH to army_lists |
| `useDeleteList()` | Mutation: delete list (cascades to entries) | `.from('army_lists').delete().eq('id', id)` |

### 7.2 TanStack Query Hook Example

```typescript
// packages/supabase-client/src/queries/units.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../client';

export function useUnitTypes(factionId: string) {
  return useQuery({
    queryKey: ['unit_types', factionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unit_types')
        .select(`
          *,
          unit_weapons (
            weapon: weapons (
              *,
              weapon_keywords (
                keyword: keywords (*),
                parameter
              )
            )
          )
        `)
        .eq('faction_id', factionId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60,  // game data rarely changes — cache for 1 hour
  });
}
```

### 7.3 Edge Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `resolve-share` | GET `/functions/v1/resolve-share?token={t}` | Validates token, increments view count, returns full list payload |
| `export-pdf` | POST `/functions/v1/export-pdf` | Accepts army list ID, renders a formatted PDF roster, returns binary stream |

---

## 8. Responsive Design & Navigation

The application uses a single breakpoint strategy that matches the three primary contexts in which users interact with the app.

### 8.1 Breakpoints

| Breakpoint | Pixels | Context | Navigation | Layout |
|------------|--------|---------|------------|--------|
| sm (mobile) | < 768px | Phone (portrait or landscape) | Fixed bottom tab bar — 5 tabs | Single-column stack; full-width cards |
| md (tablet) | 768–1023px | iPad / Android tablet | Collapsible left drawer sidebar | Two-column: sidebar unit list + main panel |
| lg (desktop) | ≥ 1024px | Laptop / desktop browser | Persistent left sidebar (240px) | Three-column: factions | units | army list |

### 8.2 Navigation Structure

```
Bottom Tabs (mobile) / Sidebar (tablet+)
├── Home           — Faction selector + featured lists
├── Builder        — Active army builder (current faction)
├── My Lists       — Saved armies grid
├── Community      — Public shared lists browse
└── Profile        — Settings, OAuth accounts, logout
```

### 8.3 AppShell Pattern

```tsx
// apps/web/src/components/layout/AppShell.tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dfa-black">
      {/* Sidebar: hidden on mobile, visible md+ */}
      <Sidebar className="hidden md:flex md:w-60 flex-col shrink-0" />

      {/* Main content: bottom padding on mobile for tab bar */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Bottom nav: visible on mobile only */}
      <BottomNav className="fixed bottom-0 inset-x-0 md:hidden z-50" />
    </div>
  );
}
```

### 8.4 Responsive Grid

```tsx
// Unit grid: 1 col → 2 col → 3 col
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
  {units.map(u => <UnitCard key={u.id} unit={u} />)}
</div>

// Army builder: stacked on mobile, side-by-side on lg+
<div className="flex flex-col lg:flex-row gap-4">
  <UnitPicker className="flex-1" />
  <ArmySidebar className="lg:w-80 xl:w-96" />
</div>
```

---

## 9. UI Component Design

### 9.1 Colour System

```css
:root {
  --dfa-red:            #8B1A1A;  /* Primary brand; section headers; active states  */
  --dfa-red-bright:     #C41E1E;  /* CTAs; points bar fill; error states            */
  --dfa-black:          #0D0D0D;  /* Page background (dark mode default)            */
  --dfa-surface:        #1A1A1A;  /* Cards, panels, modals                          */
  --dfa-surface-raised: #222222;  /* Elevated card hover state                      */
  --dfa-border:         #3A1A1A;  /* Subtle borders on dark backgrounds             */
  --dfa-text:           #F0EDE8;  /* Primary body text                              */
  --dfa-text-muted:     #9A8A80;  /* Secondary / helper text                        */
  --dfa-gold:           #C4943A;  /* Points values; Captain badge; highlights       */
}
```

Tailwind config extension:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'dfa-red':            '#8B1A1A',
        'dfa-red-bright':     '#C41E1E',
        'dfa-black':          '#0D0D0D',
        'dfa-surface':        '#1A1A1A',
        'dfa-surface-raised': '#222222',
        'dfa-border':         '#3A1A1A',
        'dfa-text':           '#F0EDE8',
        'dfa-text-muted':     '#9A8A80',
        'dfa-gold':           '#C4943A',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],  // headings
        body:    ['IBM Plex Sans', 'sans-serif'],      // body text
        mono:    ['IBM Plex Mono', 'monospace'],       // stat values
      },
    }
  }
}
```

### 9.2 Core Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `FactionCard` | Hero image, name, lore excerpt, Select button | `faction`, `onSelect`, `isSelected` |
| `UnitCard` | Stat block grid, abilities on tap/hover, Add to Army button | `unit`, `onAdd`, `isAdded`, `quantity` |
| `StatBlock` | 6-stat grid matching rulebook layout (Act/Mov/Mel/Ran/Def/HP) | `stats: UnitStats` |
| `AbilityList` | Expandable list of ability name + description rows | `abilities: Ability[]` |
| `WeaponTable` | Scrollable table: Name, Range, Attacks, Damage, AP, Keywords | `weapons: Weapon[]` |
| `ArmyList` | Scrollable list of added units with +/- qty controls | `entries`, `onRemove`, `onQtyChange` |
| `PointsBar` | Animated progress bar 0–1000pts; colour shifts red near cap | `current`, `max=1000` |
| `ShareModal` | Generate/copy share link, toggle public/private, QR code | `listId`, `token` |
| `ValidationAlert` | Inline error if army rule violated | `errors: string[]` |
| `BottomNav` | Fixed bottom navigation; active tab highlight | `routes` |

### 9.3 UnitCard Component

```tsx
// apps/web/src/components/unit/UnitCard.tsx
interface UnitCardProps {
  unit:       UnitType;
  onAdd:      (unit: UnitType) => ValidationResult;
  quantity?:  number;
}

export function UnitCard({ unit, onAdd, quantity = 0 }: UnitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const result = onAdd(unit);
    if (!result.ok) setError(result.error ?? null);
    else setError(null);
  };

  return (
    <motion.div
      className="bg-dfa-surface border border-dfa-border rounded-lg overflow-hidden"
      whileHover={{ borderColor: '#8B1A1A' }}
      layout
    >
      {/* Unit image */}
      <div className="relative h-32 bg-dfa-black">
        {unit.image_url && (
          <img src={unit.image_url} alt={unit.name} className="w-full h-full object-contain p-2" />
        )}
        <span className="absolute top-2 right-2 text-xs font-mono text-dfa-gold font-bold">
          {unit.points}pts
        </span>
        <RoleBadge role={unit.role} />
      </div>

      {/* Name + stat block */}
      <div className="p-3">
        <h3 className="font-display text-dfa-text font-bold text-lg leading-tight mb-2">
          {unit.name}
        </h3>
        <StatBlock stats={unit} />
      </div>

      {/* Expandable abilities + weapons */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 text-xs text-dfa-text-muted hover:text-dfa-text flex items-center justify-between border-t border-dfa-border"
      >
        <span>Abilities & Weapons</span>
        <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={14} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-dfa-border space-y-3">
              <AbilityList abilities={unit.abilities} />
              <WeaponTable weapons={unit.weapons} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error + Add button */}
      {error && <p className="px-3 pb-1 text-xs text-red-400">{error}</p>}
      <div className="p-3 pt-0">
        <button
          onClick={handleAdd}
          className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded transition-colors"
        >
          {quantity > 0 ? `Add Another (×${quantity})` : 'Add to Army'}
        </button>
      </div>
    </motion.div>
  );
}
```

---

## 10. Sharing & External Links

### 10.1 Army List Sharing

Every army list has a unique `share_token` (12-byte URL-safe base64 string). Toggling a list to public enables the share link. The link resolves server-side via the `resolve-share` Edge Function.

```
Share URL format:   https://dfa.app/share/{share_token}
API resolution:     /functions/v1/resolve-share?token={share_token}

Share link displays:
  • Faction name + hero image
  • Full army list with unit images
  • Total points
  • All abilities and weapon profiles (read-only)
  • 'Build My Own' CTA linking to the faction builder
```

### 10.2 External Product Links

| Location | Link Text | Destination |
|----------|-----------|-------------|
| FactionCard | Buy Miniatures | `faction.store_url` → wargamesatlantic.com |
| UnitCard (modal) | View on Store | `unit_type.store_url` → specific product |
| Share view header | Get the Rulebook | `faction.rulebook_url` → official PDF / page |
| Army export PDF | QR code + URL | `faction.store_url` embedded in export |

---

## 11. Build & Deployment

### 11.1 Local Development Setup

```bash
# Prerequisites: Node 20+, Docker (for local Supabase), pnpm 9+

# 1. Clone and install
git clone https://github.com/Sebgedge87/Project-DFA.git
cd Project-DFA
pnpm install

# 2. Start local Supabase (Docker required)
npx supabase start

# 3. Run migrations + seed game data
npx supabase db reset

# 4. Copy environment variables
cp apps/web/.env.example apps/web/.env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from 'supabase start' output

# 5. Start web app
pnpm --filter web dev

# 6. (Optional) Start mobile app
pnpm --filter mobile start
```

### 11.2 Environment Variables

| Variable | App | Description |
|----------|-----|-------------|
| `VITE_SUPABASE_URL` | web | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | web | Supabase public anon key (safe to expose) |
| `VITE_APP_URL` | web | Base URL for share links (e.g. https://dfa.app) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Server-only key — never in client bundle |
| `EXPO_PUBLIC_SUPABASE_URL` | mobile | Same Supabase URL for React Native |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | mobile | Same anon key for React Native |
| `SENTRY_DSN_WEB` | web / CI | Sentry error reporting DSN |
| `SENTRY_DSN_MOBILE` | mobile / CI | Sentry mobile DSN |
| `POSTHOG_KEY` | web + mobile | PostHog analytics key |

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm test:e2e

  deploy-web:
    if: github.ref == 'refs/heads/main'
    needs: [lint-and-type-check, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter web build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

# .github/workflows/build-mobile.yml
name: Mobile Build

on:
  push:
    tags: ['v*.*.*']

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --non-interactive

  build-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --non-interactive
```

### 11.4 turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## 12. Game Data — Seed Strategy

All roster data (factions, units, weapons, keywords) is static and owned by Wargames Atlantic. It is seeded once via a TypeScript seed script that inserts into Supabase using the service role key. Unit images are uploaded to Supabase Storage during seeding.

### 12.1 Factions to Seed

| Faction | Slug | Store URL (base) |
|---------|------|-----------------|
| The Bulldogs | bulldogs | wargamesatlantic.com/products/bulldogs |
| Les Grognards | les-grognards | wargamesatlantic.com/products/les-grognards |
| Einherjar | einherjar | wargamesatlantic.com/products/einherjar |
| Ooh Rah | ooh-rah | wargamesatlantic.com/products/ooh-rah |
| Raumjäger | raumjager | wargamesatlantic.com/products/raumjager |
| The SneakFeet | sneakfeet | wargamesatlantic.com/products/sneakfeet |

### 12.2 Image Assets Required

- Faction hero art (one per faction, min 1200×800px)
- Unit model photography (one per unit_type, min 400×400px, transparent or dark background)
- Weapon illustrations (optional; can reuse rulebook art with permission)
- Faction badge / logo (SVG preferred; used in small contexts)

> **Note:** All images should be optimised (WebP format, max 200KB per unit image) before upload to Supabase Storage. The seed script handles upload and updates the `image_url` column automatically.

### 12.3 Seed Script Structure

```typescript
// supabase/seed/index.ts
import { createClient } from '@supabase/supabase-js';
import { factions } from './data/factions';
import { unitTypes } from './data/unit-types';
import { weapons } from './data/weapons';
import { keywords } from './data/keywords';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log('Seeding keywords...');
  await supabase.from('keywords').upsert(keywords, { onConflict: 'name' });

  console.log('Seeding factions...');
  await supabase.from('factions').upsert(factions, { onConflict: 'slug' });

  console.log('Seeding weapons...');
  await supabase.from('weapons').upsert(weapons, { onConflict: 'name' });

  console.log('Seeding unit types...');
  await supabase.from('unit_types').upsert(unitTypes, { onConflict: 'id' });

  console.log('Done.');
}

seed().catch(console.error);
```

---

## 13. Phased Delivery Plan

| Phase | Deliverable | Target |
|-------|-------------|--------|
| Phase 1 — Web MVP | Web app: auth, faction browser, army builder, save/load lists, share links, responsive layout (mobile-friendly web) | Week 6 |
| Phase 2 — Content & Polish | All 6 factions fully seeded with images, store links, unit images. PDF export. Public list gallery. Performance audit. | Week 10 |
| Phase 3 — Android | React Native app on Expo. Feature parity with web. Published to Google Play Store (open beta). | Week 16 |
| Phase 4 — iOS | iOS build via EAS. Sign in with Apple. App Store submission and review. | Week 20 |
| Phase 5 — v2 Features | Campaign tracker, match history, list comparison tool, community ratings on shared lists. | TBD |

---

## 14. Open Questions & Decisions Required

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Confirm Wargames Atlantic permission to use unit images and roster data in the app | Project lead | Pending |
| 2 | Confirm exact store URLs for each faction and unit — some units share a product page | Data team | Pending |
| 3 | Domain name for the web app (e.g. dfa-builder.app or dfareana.com) | Project lead | Pending |
| 4 | Apple Developer Account enrollment required for iOS distribution ($99/yr) | Project lead | Pending |
| 5 | Google Play Console account enrollment required for Android distribution ($25 one-time) | Project lead | Pending |
| 6 | Should unregistered users be able to build an army (no save) or must they log in first? | Product | Decision needed |
| 7 | Maximum number of saved army lists per free user — unlimited or capped (e.g. 5)? | Product | Decision needed |
| 8 | Supabase free tier sufficient for launch or is Pro plan needed from day one? | Engineering | Decision needed |

---

*End of Document — Death Fields Arena Army Builder Build Spec v1.0*
