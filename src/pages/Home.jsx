import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import TaskItem from "@/components/TaskItem";
import { Input } from "@/components/ui/input";
import { Base44Logo } from "@/components/Base44Logo";
import { Plus, LogOut } from "lucide-react";

const Task = base44.entities.Task;

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    const data = await Task.list();
    setTasks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await Task.create({ title: newTaskTitle.trim(), completed: false });
    setNewTaskTitle("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await Task.update(id, { completed });
    fetchTasks();
  };

  const saveTask = async (id, title) => {
    await Task.update(id, { title });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await Task.delete(id);
    fetchTasks();
  };

  const clearCompleted = async () => {
    await Promise.all(
      tasks.filter((t) => t.completed).map((t) => Task.delete(t.id))
    );
    fetchTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="flex justify-end -mt-8 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => base44.auth.logout("/login")}
            className="text-slate-500 hover:text-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            <span className="inline-flex items-center gap-2 align-middle">
              <Base44Logo className="w-9 h-9" />
              <span className="font-bold">Base44</span>
              <span>Tasks</span>
            </span>
          </h1>
          {totalCount > 0 && (
            <p className="text-slate-500 mt-2 text-sm">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 h-12 bg-white border-slate-200 rounded-xl shadow-sm"
            />
            <Button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="h-12 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No tasks yet. Add one above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onSave={saveTask}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearCompleted}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}