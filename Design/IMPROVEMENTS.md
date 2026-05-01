# Death Fields Arena - Army Builder Improvements

**Version 1.0 | May 2026**

This document outlines suggested enhancements to the Death Fields Arena Army Builder based on design review and codebase analysis.

---

## 🎨 Visual & UX Enhancements

### 1. Unit Card Imagery
**Status**: Needs Implementation  
**Priority**: High  
**Effort**: Medium

**Current State**:
- Placeholder sword icons (⚔) for missing unit images
- Generic fallback that doesn't differentiate units

**Proposed Improvement**:
- Add faction-themed unit silhouettes or icons
- Create simple SVG illustrations for each unit type
- Use faction color palette in placeholder graphics
- Implement image upload system for custom unit photos

**Implementation Notes**:
```typescript
// Fallback icon based on unit role
const getFallbackIcon = (role: UnitRole, factionColor: string) => {
  const icons = {
    captain: '👑',
    specialist: '⚡',
    core: '🛡️'
  };
  return (
    <div style={{ color: factionColor }}>
      {icons[role]}
    </div>
  );
};
```

**Files to Update**:
- `src/components/unit/UnitCard.tsx`
- Add new `src/components/unit/UnitIcon.tsx`

---

### 2. Faction Color Integration
**Status**: Needs Implementation  
**Priority**: High (Quick Win)  
**Effort**: Low

**Current State**:
- Faction colors stored in database (`color_primary`)
- Minimal usage (thin borders, subtle gradients)
- Most UI uses generic red (#8B1A1A)

**Proposed Improvement**:
- Use faction primary color more prominently:
  - Builder page header gradient
  - Army sidebar accent color
  - Unit role badges with faction tint
  - Points bar fill color
  - Primary action buttons

**Implementation Notes**:
```tsx
// In builder page header
<div 
  className="p-4 md:px-6"
  style={{ 
    background: `linear-gradient(135deg, #${faction.color_primary}33 0%, var(--dfa-black) 100%)` 
  }}
>
```

**Files to Update**:
- `src/pages/builder/[faction].tsx`
- `src/components/builder/PointsBar.tsx`
- `src/components/unit/RoleBadge.tsx`

---

### 3. Points Bar Visualization
**Status**: Needs Implementation  
**Priority**: High (Quick Win)  
**Effort**: Low

**Current State**:
- Simple progress bar with percentage
- Shows `314 / 1000pts` and `31%`
- No visual guidance for point budget planning

**Proposed Improvement**:
- Add breakpoint markers at 250 / 500 / 750 / 1000pts
- Color zones:
  - **Green**: 0-800pts (safe)
  - **Yellow**: 800-950pts (caution)
  - **Red**: 950-1000pts (nearly full)
  - **Over-red**: 1000+ (invalid)
- Show "points remaining" prominently
- Add subtle tick marks for reference

**Visual Design**:
```
[████████████░░░░] 
 ↑   ↑   ↑   ↑
250 500 750 1000
```

**Files to Update**:
- `src/components/builder/PointsBar.tsx`

---

### 4. Empty States
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: Low

**Current State**:
- Plain text: "Add units from the list to build your army."
- No visual guidance or helpful tips

**Proposed Improvement**:
- Illustrative empty state with icon + helpful tips
- Sample army composition guide:
  - "✓ Start with 1 Captain (required)"
  - "Add 2-3 Specialists for tactical flexibility"
  - "Fill remaining points with Core units"
- Link to rules or quick-start guide
- Show example armies

**Files to Update**:
- `src/pages/builder/[faction].tsx` (army sidebar)
- Add new `src/components/builder/EmptyArmyState.tsx`

---

## ⚡ Functional Improvements

### 5. Quick Add from Faction Roster
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: Low

**Current State**:
- Faction Info tab displays read-only roster table
- Users must switch back to Units tab to add units

**Proposed Improvement**:
- Add small "+" button next to each unit's points value in roster table
- Inline add without tab switching
- Show quick validation feedback (✓ added / ⚠ can't add)

**Files to Update**:
- `src/pages/builder/[faction].tsx` (Faction Info tab roster section)

---

### 6. Unit Comparison Mode
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: High

**Current State**:
- Users must manually remember stats when comparing units
- No side-by-side comparison tool

**Proposed Improvement**:
- Toggle "Compare Mode" button
- Select 2-3 units to compare side-by-side
- Highlight stat differences:
  - Higher values in green
  - Lower values in red
  - Equal values in neutral
- Compare abilities, weapons, and points efficiency

**Implementation Notes**:
```tsx
// Comparison grid
<div className="grid grid-cols-3 gap-4">
  {selectedUnits.map(unit => (
    <UnitComparisonCard key={unit.id} unit={unit} />
  ))}
</div>
```

**Files to Add**:
- `src/components/builder/ComparisonMode.tsx`
- `src/components/unit/UnitComparisonCard.tsx`

---

### 7. Army Validation Indicators
**Status**: Needs Implementation  
**Priority**: High (Quick Win)  
**Effort**: Medium

**Current State**:
- Only shows errors (red alerts)
- No positive feedback when army is valid
- No progressive guidance

**Proposed Improvement**:
- Show "✓ Valid Army" green badge when complete
- Progressive checklist system:
  - ✓ Captain selected (required)
  - ✓ At least 3 units
  - ✓ Under 1000pts
  - ✓ No duplicate limitations violated
- Warning indicators before hard errors:
  - "⚠ 90% of points used"
  - "⚠ Only 1 Captain allowed"
- Visual progress bar for validation steps

**Files to Update**:
- `src/components/builder/ValidationAlert.tsx`
- Add new `src/components/builder/ValidationChecklist.tsx`

---

### 8. Duplicate Army
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: Low

**Current State**:
- Can clone template armies
- Cannot duplicate your own saved armies
- No way to create variations of existing lists

**Proposed Improvement**:
- Add "Duplicate" button on My Lists page
- Creates copy with " (Copy)" suffix
- Opens in builder immediately
- Useful for creating army variations

**Implementation Notes**:
```typescript
const duplicateList = async (listId: string) => {
  const original = await getList(listId);
  const copy = {
    ...original,
    id: generateId(),
    name: `${original.name} (Copy)`,
    created_at: new Date().toISOString()
  };
  await saveList(copy);
  return copy.id;
};
```

**Files to Update**:
- `src/pages/my-lists.tsx`
- Add mutation to `@dfa/supabase-client`

---

## 📱 Mobile Experience

### 9. Mobile Army Builder Layout
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: High

**Current State**:
- Stacked layout: units on top, army list below
- Sticky summary bar with "View Army" button
- Requires scrolling to see army composition

**Proposed Improvement**:
- Floating Action Button (FAB) for "View Army"
- Opens army list as bottom sheet / drawer
- Sticky, collapsing filter bar
- Swipe gestures to adjust quantities
- Pull-to-refresh for data

**Files to Update**:
- `src/pages/builder/[faction].tsx`
- Add new `src/components/mobile/BottomSheet.tsx`
- Add new `src/components/mobile/FloatingActionButton.tsx`

---

### 10. Touch-Friendly Controls
**Status**: Needs Implementation  
**Priority**: High  
**Effort**: Low

**Current State**:
- Small +/- buttons (28×28px)
- Below recommended touch target size (44×44px)
- No swipe gestures

**Proposed Improvement**:
- Increase touch targets to 44×44px minimum
- Add swipe-to-delete on army entries
- Long-press on unit cards for quick actions menu:
  - Add to army
  - View details
  - Compare
- Haptic feedback on interactions (mobile)

**Files to Update**:
- `src/components/unit/UnitCard.tsx`
- `src/pages/builder/[faction].tsx` (army entry controls)
- `tailwind.config.js` (add touch-target utility classes)

---

## 🎯 Army Building Experience

### 11. Point Budget Recommendations
**Status**: Needs Implementation  
**Priority**: High (Quick Win)  
**Effort**: Medium

**Current State**:
- No preview of points impact before adding unit
- Users must calculate remaining points manually

**Proposed Improvement**:
- Hover tooltip on "Add to Army" button showing:
  - "This will bring you to **438pts**"
  - "You'll have **562pts** remaining"
  - Color-coded indicator:
    - 🟢 Safe (plenty of room)
    - 🟡 Caution (getting tight)
    - 🔴 Over budget (can't add)
- Show preview in button itself on mobile (no hover)

**Implementation Notes**:
```tsx
const remaining = 1000 - (currentPoints + unit.points);
const status = remaining < 0 ? 'over' : remaining < 100 ? 'caution' : 'safe';

<Tooltip>
  <span className={statusColors[status]}>
    Adding will bring you to {currentPoints + unit.points}pts
    <br />
    {remaining}pts remaining
  </span>
</Tooltip>
```

**Files to Update**:
- `src/components/unit/UnitCard.tsx`
- Add new `src/components/ui/PointsTooltip.tsx`

---

### 12. Unit Suggestions
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: High

**Current State**:
- No guidance on completing army composition
- Users left to figure out optimal builds

**Proposed Improvement**:
- "Complete Your Army" suggestion section
- AI/rule-based recommendations:
  - "You have 124pts left — consider adding another Commando"
  - "Your army lacks ranged units — try adding a Gunner"
  - "Balanced composition: add 1 more Specialist"
- Show 2-3 suggested units with "Quick Add" buttons
- Dismissible suggestions

**Implementation Notes**:
```typescript
const getSuggestions = (entries: ArmyEntry[], remaining: number) => {
  // Rule-based logic
  const hasRanged = entries.some(e => e.unit_type.weapons.some(w => w.range > 6));
  const captainCount = entries.filter(e => e.unit_type.role === 'captain').length;
  
  if (captainCount === 0) return [{ reason: 'Required', units: captainUnits }];
  if (!hasRanged) return [{ reason: 'Add ranged support', units: rangedUnits }];
  // ... more rules
};
```

**Files to Add**:
- `src/components/builder/UnitSuggestions.tsx`
- `src/logic/suggestions.ts`

---

### 13. Recently Added Highlight
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Low

**Current State**:
- No visual feedback when unit is added
- Unit appears in sidebar with no animation
- Hard to track what was just added

**Proposed Improvement**:
- Brief highlight/pulse animation on newly added units
- Highlight in both:
  - Unit card in grid (green border pulse)
  - Army sidebar entry (background flash)
- 2-second duration, then fade out
- Scroll to newly added entry in sidebar

**Files to Update**:
- `src/components/unit/UnitCard.tsx`
- `src/pages/builder/[faction].tsx` (army entries)
- `src/stores/armyStore.ts` (track lastAddedId)

---

## 🔍 Advanced Filtering

### 14. Multi-Dimensional Filters
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: Medium

**Current State**:
- Search by name only
- Role filter (Captain/Specialist/Core)
- No advanced filtering options

**Proposed Improvement**:
- Points range slider (0-200pts)
- Keyword/ability tags:
  - "Ranged", "Melee", "Support"
  - "Veteran", "Fast", "Tough"
- Stats filters:
  - HP: 3 / 4 / 5+
  - Defense: 3+ / 4+ / 5+
  - Movement: 6" / 7" / 8"+
- Weapon type filter (plasma, kinetic, melee)
- "Has abilities" toggle

**UI Design**:
```
[Search box          ]
[All][Captain][Specialist][Core]
[+ More Filters ▼]

  When expanded:
  Points: [====|====] 0 - 200
  Stats: [HP 5+] [Def 4+] [Mov 7"+]
  Tags: [Ranged] [Melee] [Support]
```

**Files to Update**:
- `src/pages/builder/[faction].tsx`
- Add new `src/components/builder/AdvancedFilters.tsx`

---

### 15. Sort Options
**Status**: Needs Implementation  
**Priority**: Medium  
**Effort**: Low

**Current State**:
- Units appear in database order
- No way to sort or reorder

**Proposed Improvement**:
- Sort dropdown with options:
  - **Points** (low to high / high to low)
  - **Name** (A-Z / Z-A)
  - **Role** (Captain → Specialist → Core)
  - **HP** (highest first)
  - **Movement** (fastest first)
- Default: Role, then Points ascending
- Persist sort preference in localStorage

**Files to Update**:
- `src/pages/builder/[faction].tsx`
- Add new `src/components/builder/SortSelector.tsx`

---

## 📊 Army Analytics

### 16. Army Composition Chart
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Medium

**Current State**:
- No visual analytics
- Only raw numbers (points total, model count)

**Proposed Improvement**:
- Visual breakdown charts:
  - **Pie chart**: % of points spent per role
    - Captain: 12%
    - Specialists: 38%
    - Core: 50%
  - **Bar chart**: Model count by role
  - **Line chart**: Points allocation over time (as you build)
- Collapsible "Army Stats" panel in sidebar
- Export chart as image

**Libraries**:
- Consider: Chart.js, Recharts, or D3.js

**Files to Add**:
- `src/components/builder/ArmyCharts.tsx`
- `src/components/charts/PieChart.tsx`
- `src/components/charts/BarChart.tsx`

---

### 17. Capability Summary
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Medium

**Current State**:
- No aggregate army statistics
- Must manually calculate army-wide averages

**Proposed Improvement**:
- Show army-wide summary:
  - **Total Models**: 8
  - **Total HP Pool**: 38
  - **Average Movement**: 7.2"
  - **Ranged Units**: 5 (62%)
  - **Melee Units**: 3 (38%)
  - **Total Actions**: 17 per turn
- "Army at a Glance" card
- Compare against faction average or community benchmarks

**Implementation Notes**:
```typescript
const calculateArmyStats = (entries: ArmyEntry[]) => {
  const totalModels = entries.reduce((s, e) => s + e.quantity, 0);
  const totalHP = entries.reduce((s, e) => s + (e.unit_type.health * e.quantity), 0);
  const avgMovement = entries.reduce((s, e) => s + (e.unit_type.movement * e.quantity), 0) / totalModels;
  // ... more calculations
  return { totalModels, totalHP, avgMovement };
};
```

**Files to Add**:
- `src/components/builder/ArmyCapabilities.tsx`
- `src/logic/armyAnalytics.ts`

---

## 🎨 Polish & Delight

### 18. Micro-Animations
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Medium

**Current State**:
- Basic hover states
- Simple expand/collapse animations
- No feedback animations

**Proposed Improvement**:
- Points bar fills smoothly when units added (CSS transition)
- Cards slide in when filtering (Framer Motion stagger)
- Success animation when saving:
  - Confetti effect (canvas particles)
  - Or subtle pulse + checkmark
- Number count-up animation for points
- Bounce effect on validation errors

**Libraries**:
- Already using Framer Motion
- Add: canvas-confetti for celebration

**Files to Update**:
- `src/components/builder/PointsBar.tsx`
- `src/pages/builder/[faction].tsx`
- Add new `src/components/effects/Confetti.tsx`

---

### 19. Keyboard Shortcuts
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Low

**Current State**:
- No keyboard shortcuts
- Must use mouse for all interactions

**Proposed Improvement**:
- Add power-user shortcuts:
  - **/** — Focus search box
  - **Ctrl/Cmd + S** — Save army
  - **Ctrl/Cmd + K** — Open command palette
  - **1 / 2 / 3 / 4** — Switch role filters (All/Captain/Specialist/Core)
  - **Esc** — Clear filters / close modals
  - **Arrow keys** — Navigate unit cards
  - **Enter** — Add selected unit to army
- Show shortcuts in tooltips
- "?" key to show keyboard shortcuts help modal

**Implementation Notes**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

**Files to Update**:
- `src/pages/builder/[faction].tsx`
- Add new `src/hooks/useKeyboardShortcuts.ts`
- Add new `src/components/ui/KeyboardShortcutsModal.tsx`

---

### 20. Dark Mode Optimization
**Status**: Needs Implementation  
**Priority**: Low  
**Effort**: Medium

**Current State**:
- Single dark theme
- No customization options
- Could improve contrast and accessibility

**Proposed Improvement**:
- Improve existing dark mode:
  - Add subtle noise texture to backgrounds
  - Improve contrast ratios (WCAG AAA)
  - Increase text shadows for readability
- Optional theme variants:
  - **Battlefield** — tactical grid pattern background
  - **Arena** — red accent theme
  - **Classic** — higher contrast, no gradients
- Theme switcher in profile settings

**Implementation Notes**:
```css
/* Noise texture */
.bg-dfa-black {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
}
```

**Files to Update**:
- `src/index.css`
- `tailwind.config.js`
- Add new `src/components/settings/ThemeSwitcher.tsx`

---

## 🚀 Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)
- ✅ Faction Color Integration (#2)
- ✅ Points Bar Visualization (#3)
- ✅ Army Validation Indicators (#7)
- ✅ Point Budget Recommendations (#11)

### Phase 2: Core Features (3-4 weeks)
- ✅ Unit Card Imagery (#1)
- ✅ Empty States (#4)
- ✅ Quick Add from Roster (#5)
- ✅ Touch-Friendly Controls (#10)
- ✅ Advanced Filtering (#14)
- ✅ Sort Options (#15)

### Phase 3: Polish & Advanced (4-6 weeks)
- ✅ Duplicate Army (#8)
- ✅ Recently Added Highlight (#13)
- ✅ Micro-Animations (#18)
- ✅ Keyboard Shortcuts (#19)
- ✅ Army Composition Chart (#16)
- ✅ Capability Summary (#17)

### Phase 4: Experimental (Future)
- ✅ Unit Comparison Mode (#6)
- ✅ Mobile Bottom Sheet (#9)
- ✅ Unit Suggestions (#12)
- ✅ Dark Mode Variants (#20)

---

## 📈 Success Metrics

Track these KPIs to measure improvement impact:

- **User Engagement**:
  - Time to complete first army (target: < 10 minutes)
  - Number of armies created per user
  - Return visit rate

- **UX Quality**:
  - Validation errors per army (target: < 0.5)
  - Mobile vs desktop usage ratio
  - Feature adoption rate (filters, shortcuts, etc.)

- **Performance**:
  - Page load time (target: < 2s)
  - Time to interactive (target: < 3s)
  - Error rate (target: < 1%)

---

## 💡 Contributing

To propose new improvements:

1. Create a GitHub issue with the `enhancement` label
2. Use the template:
   ```
   **Feature Name**: [Brief title]
   **Priority**: High / Medium / Low
   **Effort**: Low / Medium / High
   **Problem**: [What user pain point does this solve?]
   **Proposal**: [How should it work?]
   **Alternatives**: [Other approaches considered]
   ```

3. Tag with relevant labels: `ux`, `mobile`, `performance`, `accessibility`

---

**Last Updated**: May 1, 2026  
**Maintained By**: DFA Team  
**Version**: 1.0
