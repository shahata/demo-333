import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Public, read-only: returns only the global "tasks created" number.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const total = await base44.asServiceRole.entities.TaskCreation.count({});
    return Response.json({ total });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}