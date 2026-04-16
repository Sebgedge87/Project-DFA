// Army builder state — persists draft to localStorage
// Full implementation: packages/logic handles all validation
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TODO: import from @dfa/logic and @dfa/types once implemented
export const useArmyStore = create()(
  persist(
    (_set, _get) => ({
      listId: null,
      listName: 'My Army',
      faction: null,
      entries: [],
      isDirty: false,
    }),
    { name: 'dfa-army-draft' }
  )
);
