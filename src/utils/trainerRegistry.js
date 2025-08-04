// utils/trainerRegistry.js
const ctx = import.meta.glob('../trainers/**/index.js', { eager: true });

export const TRAINERS = Object.values(ctx).map(m => m.default);
export const byId     = Object.fromEntries(TRAINERS.map(t => [t.id, t]));