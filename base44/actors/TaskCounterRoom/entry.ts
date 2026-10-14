import { Actor } from 'base44:runtime/actors';

const MIN_REFRESH_MS = 1000;

export default class TaskCounterRoom extends Actor {
  total = 0;
  lastRefresh = 0;

  async handleStart() {
    this.total = (await this.storage.get('total')) ?? 0;
  }

  async handleConnect(conn) {
    conn.send({ type: 'hello', v: 3 });
    await this.refresh(true);
    conn.send({ type: 'total', total: this.total });
  }

  async handleMessage(conn, msg) {
    if (typeof msg !== 'object' || msg === null || msg.type !== 'refresh') return;
    await this.refresh(false);
  }

  // The count always comes from the database, so clients can only ask for a
  // re-check, never set the number themselves.
  async refresh(force) {
    const now = Date.now();
    if (!force && now - this.lastRefresh < MIN_REFRESH_MS) return;
    this.lastRefresh = now;
    let res;
    try {
      res = await this.client.functions.invoke('getTaskCount', {});
    } catch (e) {
      throw new Error('invoke failed: ' + String(e && e.message));
    }
    const total = res.data.total;
    if (total === this.total && !force) return;
    this.total = total;
    await this.storage.put('total', total);
    this.broadcast({ type: 'total', total });
  }
}