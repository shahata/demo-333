export async function recordTaskCreated(base44, taskId) {
  await base44.asServiceRole.entities.TaskCreation.create({ task_id: taskId });
}