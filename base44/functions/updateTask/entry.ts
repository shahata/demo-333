import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { containsProfanity, validTitle } from '../../shared/profanity.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, title, completed } = await req.json();
    if (typeof id !== 'string' || !id) return Response.json({ error: 'Invalid id' }, { status: 400 });

    const changes = {};
    if (title !== undefined) {
      if (!validTitle(title)) return Response.json({ error: 'Invalid title' }, { status: 400 });
      if (await containsProfanity(base44, title)) {
        return Response.json({ error: 'Task rejected: the title contains profanity.' }, { status: 422 });
      }
      changes.title = title.trim();
    }
    if (typeof completed === 'boolean') changes.completed = completed;
    if (Object.keys(changes).length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 });

    const existing = await base44.asServiceRole.entities.Task.get(id);
    if (!existing || existing.created_by_id !== user.id) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = await base44.asServiceRole.entities.Task.update(id, changes);
    return Response.json({ task });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}