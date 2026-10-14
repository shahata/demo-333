import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { containsProfanity, validTitle } from '../../shared/profanity.ts';
import { recordTaskCreated } from '../../shared/taskCounter.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { title } = await req.json();
    if (!validTitle(title)) return Response.json({ error: 'Invalid title' }, { status: 400 });

    if (await containsProfanity(base44, title)) {
      return Response.json({ error: 'Task rejected: the title contains profanity.' }, { status: 422 });
    }

    const task = await base44.asServiceRole.entities.Task.create({
      title: title.trim(),
      completed: false,
      owner_id: user.id,
    });
    await recordTaskCreated(base44, task.id);
    return Response.json({ task });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}