import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles } from "lucide-react";

export default function TaskCounter() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    let connId = sessionStorage.getItem("connId");
    if (!connId) {
      connId = crypto.randomUUID();
      sessionStorage.setItem("connId", connId);
    }
    const room = base44.actors.TaskCounterRoom("global-v2").connect({ id: connId });
    const sub = room.subscribe((msg) => {
      if (msg?.type === "total") setTotal(msg.total);
    });
    // Ask the room to re-check the count after this user creates a task.
    const onCreated = () => room.send({ type: "refresh" });
    window.addEventListener("task-created", onCreated);
    return () => {
      window.removeEventListener("task-created", onCreated);
      sub.unsubscribe();
      room.close();
    };
  }, []);

  if (total === null) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm text-slate-500">
      <Sparkles className="w-4 h-4 text-orange-500" />
      <span>
        <span className="font-semibold text-slate-900 tabular-nums">
          {total.toLocaleString()}
        </span>{" "}
        tasks created and counting
      </span>
    </div>
  );
}