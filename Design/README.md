# Death Fields Arena - Design Documentation

**Project DFA | May 2026**

This project contains high-fidelity design renders, diagrams, and improvement recommendations for the Death Fields Arena Army Builder web application.

---

## 📂 Project Structure

```
DFA/
├── renders.html              # Page mockups (7 screens)
├── diagrams.html             # ERD, User Flow, Auth Flow
├── IMPROVEMENTS.md           # 20 recommended enhancements
├── screenshots/              # PNG exports of all pages
│   ├── 01-home.png
│   ├── 02-builder.png
│   ├── 03-my-lists.png
│   ├── 04-community.png
│   ├── 05-profile.png
│   ├── 06-auth.png
│   ├── 07-share.png
│   ├── 08-erd.png
│   ├── 09-user-flow.png
│   └── 10-auth-flow.png
└── src/                      # Imported source files from GitHub
    ├── pages/
    ├── components/
    └── ...
```

---

## 🎨 Design Files

### 1. `renders.html` — Page Mockups
Interactive HTML mockup showing all 7 main pages of the Army Builder:

- **Home** — Faction selection grid
- **Builder** — Army building interface with unit cards and army sidebar
- **My Lists** — Saved armies management
- **Community** — Publicly shared army lists
- **Profile** — User profile and army collection
- **Auth** — Sign-in page (Google, Discord, Magic Link)
- **Share** — Public army view page

**Features**:
- Pixel-perfect reproduction of actual app design
- Authentic Death Fields Arena branding
- Navigation between pages
- Responsive layout previews

**View**: Open `renders.html` in your browser

---

### 2. `diagrams.html` — Technical Diagrams
Three interactive diagram views:

#### Entity Relationship Diagram (ERD)
Complete database schema showing:
- **8 tables**: users, profiles, factions, unit_types, weapons, keywords, army_lists, army_entries
- **Relationships**: Foreign keys and join tables
- **RLS Policies**: Row-level security rules
- **Indexes**: Performance optimization

#### User Flow Diagram
Step-by-step army building flow:
1. Choose faction
2. Search/filter units
3. Add units to army
4. Validate composition
5. Save & share
6. Responsive behavior annotations

#### Authentication Flow
OAuth and Magic Link authentication:
- Google/Discord OAuth flow
- Magic link email flow
- Session management
- RLS enforcement
- Supabase Auth integration

**View**: Open `diagrams.html` in your browser

---

### 3. `IMPROVEMENTS.md` — Enhancement Recommendations
Comprehensive improvement document with **20 suggested enhancements** across 6 categories:

1. **Visual & UX** (4 improvements)
   - Unit card imagery
   - Faction color integration ⭐ Quick Win
   - Points bar visualization ⭐ Quick Win
   - Empty states

2. **Functional** (4 improvements)
   - Quick add from roster
   - Unit comparison mode
   - Army validation indicators ⭐ Quick Win
   - Duplicate army

3. **Mobile** (2 improvements)
   - Mobile layout optimization
   - Touch-friendly controls

4. **Army Building** (3 improvements)
   - Point budget recommendations ⭐ Quick Win
   - Unit suggestions
   - Recently added highlight

5. **Filtering** (2 improvements)
   - Multi-dimensional filters
   - Sort options

6. **Analytics & Polish** (5 improvements)
   - Army composition charts
   - Capability summary
   - Micro-animations
   - Keyboard shortcuts
   - Dark mode optimization

**Each improvement includes**:
- Priority (High/Medium/Low)
- Effort estimate (Low/Medium/High)
- Current state analysis
- Detailed proposal
- Implementation notes with code examples
- Files to update

**View**: Open `IMPROVEMENTS.md`

---

## 🚀 Quick Wins

If you can only implement a few improvements, start with these **4 high-impact, low-effort** changes:

### 1. Faction Color Integration
**Impact**: High | **Effort**: Low | **Time**: 1-2 days

Use faction primary colors more prominently throughout the builder interface.

**Files**: `src/pages/builder/[faction].tsx`, `src/components/builder/PointsBar.tsx`

---

### 2. Points Bar Visualization
**Impact**: High | **Effort**: Low | **Time**: 2-3 days

Add breakpoint markers, color zones, and "points remaining" display.

**Files**: `src/components/builder/PointsBar.tsx`

---

### 3. Army Validation Indicators
**Impact**: High | **Effort**: Medium | **Time**: 3-4 days

Show progressive validation checklist with positive feedback.

**Files**: `src/components/builder/ValidationAlert.tsx`, add `ValidationChecklist.tsx`

---

### 4. Point Budget Recommendations
**Impact**: High | **Effort**: Medium | **Time**: 3-4 days

Show point impact preview when hovering "Add to Army" button.

**Files**: `src/components/unit/UnitCard.tsx`, add `PointsTooltip.tsx`

---

## 🎯 Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)
- Faction Color Integration
- Points Bar Visualization
- Army Validation Indicators
- Point Budget Recommendations

### Phase 2: Core Features (3-4 weeks)
- Unit Card Imagery
- Empty States
- Quick Add from Roster
- Touch-Friendly Controls
- Advanced Filtering
- Sort Options

### Phase 3: Polish & Advanced (4-6 weeks)
- Duplicate Army
- Recently Added Highlight
- Micro-Animations
- Keyboard Shortcuts
- Army Composition Charts
- Capability Summary

### Phase 4: Experimental (Future)
- Unit Comparison Mode
- Mobile Bottom Sheet
- Unit Suggestions
- Dark Mode Variants

---

## 🎨 Design System

### Colors
```css
--dfa-red:           #8B1A1A  /* Primary brand color */
--dfa-red-bright:    #C41E1E  /* Hover state */
--dfa-black:         #0D0D0D  /* Background */
--dfa-surface:       #1A1A1A  /* Cards */
--dfa-surface-raised:#222222  /* Elevated elements */
--dfa-border:        #3A1A1A  /* Red-tinted borders */
--dfa-border-neutral:#2A2A2A  /* Neutral borders */
--dfa-text:          #F0EDE8  /* Primary text */
--dfa-text-muted:    #9A8A80  /* Secondary text */
--dfa-gold:          #C4943A  /* Points, accents */
```

### Typography
- **Display**: Barlow Condensed (600, 700, 800)
- **Body**: IBM Plex Sans (400, 500, 600)
- **Mono**: IBM Plex Mono (400, 600)

### Spacing Scale
```
4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px
```

---

## 📸 Screenshots

All page renders have been exported as PNG files in the `screenshots/` directory:

1. `01-home.png` — Faction selection
2. `02-builder.png` — Army builder interface
3. `03-my-lists.png` — Saved armies
4. `04-community.png` — Community armies
5. `05-profile.png` — User profile
6. `06-auth.png` — Authentication
7. `07-share.png` — Shared army view
8. `08-erd.png` — Entity relationship diagram
9. `09-user-flow.png` — User flow diagram
10. `10-auth-flow.png` — Authentication flow

---

## 🔗 Source Repository

Original codebase: [github.com/Sebgedge87/Project-DFA](https://github.com/Sebgedge87/Project-DFA)

- **Main Branch**: `main`
- **Web App**: `apps/web/`
- **Design Docs**: `Design/`

---

## 📋 Next Steps

1. **Review** `IMPROVEMENTS.md` and prioritize enhancements
2. **Implement** Phase 1 Quick Wins (1-2 weeks)
3. **Test** improvements with real users
4. **Iterate** based on feedback
5. **Deploy** and monitor success metrics

---

## 📞 Contact

**Project**: Death Fields Arena Army Builder  
**Repository**: github.com/Sebgedge87/Project-DFA  
**Documentation Date**: May 1, 2026

---

**Version**: 1.0  
**Status**: Design Review Complete ✅
