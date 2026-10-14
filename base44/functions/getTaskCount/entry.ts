import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Public, read-only: returns only the global "tasks created" number.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const page = await base44.asServiceRole.entities.GlobalCounter.filter({ name: 'tasks' }, { limit: 1 });
    const items = Array.isArray(page) ? page : page.items;
    return Response.json({ total: items[0]?.total ?? 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}