// Atomically adds 1 to the global "tasks created" counter.
export async function recordTaskCreated(base44) {
  await base44.asServiceRole.entities.GlobalCounter.updateMany(
    { name: 'tasks' },
    { $inc: { total: 1 } },
  );
}