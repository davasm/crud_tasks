"use client";

import { TaskTable } from "@/app/components/tables/TaskTable";
import { useTask } from "@/contexts/TaskContext";

export default function Tasks() {
  const { tasks, loading, error } = useTask();

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-gray-600">Carregando tarefas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TaskTable tasks={tasks} />
    </div>
  );
}