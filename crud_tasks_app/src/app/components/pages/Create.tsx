"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/data/model/Task";
import { useTask } from "@/contexts/TaskContext";
import { motion, AnimatePresence } from "framer-motion";

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

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      'pendente': 'border-gray-300 bg-gray-50',
      'em_andamento': 'border-blue-300 bg-blue-50',
      'concluída': 'border-green-300 bg-green-50'
    };
    return colors[status] || colors.pendente;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100"
      >
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center mb-6"
        >
          <div className="bg-orange-100 p-2 rounded-full mr-3">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {taskId ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {taskId ? "Editar Tarefa" : "Criar Nova Tarefa"}
          </h1>
        </motion.div>
        
        <AnimatePresence>
          {(error || submitError) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md flex items-center shadow-sm"
            >
              <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error || submitError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setSubmitError(null);
                  setFormData({ ...formData, title: e.target.value });
                }}
                className="block w-full rounded-md border border-gray-300 text-gray-900 px-3 py-2 pl-10 
                  focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 
                  transition-all duration-200 shadow-sm hover:shadow-md"
                required
                placeholder="Insira o título da tarefa"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setSubmitError(null);
                  setFormData({ ...formData, description: e.target.value });
                }}
                rows={4}
                className="block w-full rounded-md border border-gray-300 text-gray-900 px-3 py-2 pl-10
                  focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 
                  transition-all duration-200 shadow-sm hover:shadow-md"
                required
                placeholder="Descreva os detalhes da tarefa"
              />
              <div className="absolute left-3 top-6 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
                className={`block w-full rounded-md border text-gray-900 px-3 py-2 pl-10 
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50 
                  transition-all duration-200 shadow-sm hover:shadow-md ${getStatusColor(formData.status)}`}
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluída">Concluída</option>
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`flex-1 px-5 py-3 rounded-md text-white font-medium transition-all duration-200 shadow-md ${
                loading 
                ? 'bg-orange-400 cursor-not-allowed opacity-80' 
                : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'
              }`}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {taskId ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      )}
                    </svg>
                    {taskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                  </>
                )}
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={loading}
              onClick={() => router.push("/home")}
              className="flex-1 bg-gray-100 text-gray-700 px-5 py-3 rounded-md hover:bg-gray-200 
                transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancelar
              </span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}