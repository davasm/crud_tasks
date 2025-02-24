"use client";

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Task } from "@/data/model/Task";
import { api } from "@/services/api";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  refreshTasks: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await api.getTasks();
      if (!data) {
        throw new Error('Dados não recebidos da API');
      }
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tasks';
      setError(errorMessage);
      console.error('Erro ao carregar tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (newTask: Omit<Task, "id" | "createdAt">) => {
    try {
      setLoading(true);
      clearError();
      const task = await api.createTask(newTask);
      setTasks(prev => [...prev, task]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar task';
      setError(errorMessage);
      console.error('Erro ao adicionar task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setLoading(true);
      clearError();
      
      console.log('Tentando deletar task:', id);
      console.log('Tasks antes da deleção:', tasks);
      
      await api.deleteTask(id);
      
      setTasks(prev => {
        const newTasks = prev.filter(task => task.id !== id);
        console.log('Tasks após deleção:', newTasks);
        return newTasks;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar task';
      setError(errorMessage);
      console.error('Erro ao deletar task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, tasks]);

  const updateTask = useCallback(async (updatedTask: Task): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      const taskToUpdate = {
        ...updatedTask,
        completedAt: updatedTask.status === 'concluída' 
          ? updatedTask.completedAt || new Date().toISOString()
          : undefined
      };

      const response = await api.updateTask(updatedTask.id, taskToUpdate);
      
      if (!response) {
        throw new Error('Resposta inválida do servidor');
      }

      setTasks(prev => prev.map(t => 
        t.id === response.id ? response : t
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar task';
      setError(errorMessage);
      console.error('Erro ao atualizar task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const value = {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    refreshTasks: fetchTasks,
    loading,
    error,
    clearError
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask deve ser usado dentro de um TaskProvider');
  }
  return context;
}