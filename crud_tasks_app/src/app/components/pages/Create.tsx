"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/data/model/Task";
import { useTask } from "@/contexts/TaskContext";

export default function Create() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  const { addTask, updateTask, tasks, loading, error } = useTask();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pendente" as Task["status"],
  });

  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === Number(taskId));
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
        });
      } else {
        setSubmitError("Tarefa não encontrada");
      }
    }
  }, [taskId, tasks]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSubmitError("O título é obrigatório");
      return false;
    }
    if (!formData.description.trim()) {
      setSubmitError("A descrição é obrigatória");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) return;
    
    try {
      const taskData = {
        ...formData,
        completedAt: formData.status === 'concluída' ? new Date().toISOString() : undefined
      };

      if (taskId) {
        await updateTask({
          id: Number(taskId),
          ...taskData,
        } as Task);
      } else {
        await addTask(taskData);
      }
      router.push("/home");
    } catch (err) {
      console.error("Erro ao salvar task:", err);
      setSubmitError("Erro ao salvar tarefa. Tente novamente.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {taskId ? "Editar Tarefa" : "Criar Nova Tarefa"}
        </h1>
        
        {(error || submitError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error || submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
               type="text"
               id="title"
               value={formData.title}
               onChange={(e) => {
                 setSubmitError(null);
                 setFormData({ ...formData, title: e.target.value });
               }}
               className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 px-3 py-2 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
               required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 px-3 py-2 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
              className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 px-3 py-2 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white transition-colors ${
                loading 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? 'Salvando...' : taskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => router.push("/home")}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}