import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles } from "lucide-react";

const Creations = base44.entities.TaskCreation;

export default function TaskCounter() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    // Subscribe first and buffer, so a creation during the initial load isn't missed.
    const seen = new Set();
    let base = null;
    let extra = 0;
    const update = () => base !== null && setTotal(base + extra);

    const unsubscribe = Creations.subscribe((event) => {
      if (event.type !== "create" || seen.has(event.id)) return;
      seen.add(event.id);
      extra += 1;
      update();
    });

    Creations.count({}).then((n) => {
      base = n - extra;
      update();
    });

    return unsubscribe;
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