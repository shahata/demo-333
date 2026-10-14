import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const startEdit = () => {
    setTitle(task.title);
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSave(task.id, title.trim());
    setEditing(false);
  };

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked)}
        className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
      />
      {editing ? (
        <form onSubmit={save} className="flex-1 flex items-center gap-2">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            className="h-9 flex-1"
          />
          <Button type="submit" size="icon" variant="ghost" disabled={!title.trim()} className="h-8 w-8 text-green-600">
            <Check className="w-4 h-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => setEditing(false)} className="h-8 w-8 text-slate-400">
            <X className="w-4 h-4" />
          </Button>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 text-slate-700 transition-all ${
              task.completed ? "line-through text-slate-400" : ""
            }`}
          >
            {task.title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={startEdit}
            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-slate-700 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}