import { Task } from '@/data/model/Task';

const BASE_URL = '/api/tasks';

interface ApiError {
  error: string;
  status?: number;
}

export const api = {
  // Listar todas as tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(BASE_URL);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar tasks');
      }
      
      return response.json();
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar tasks');
    }
  },

  // Buscar task por ID
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || 'Task não encontrada');
      }
      
      return response.json();
    } catch (error) {
      console.error('Erro ao buscar task:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar task');
    }
  },

  // Criar nova task
  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || 'Erro ao criar task');
      }
      return data;
    } catch (error) {
      console.error('Erro ao criar task:', error);
      throw error instanceof Error ? error : new Error('Erro ao criar task');
    }
  },

  // Atualizar task existente
  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    try {
      console.log('Enviando atualização:', { id, task }); // Debug

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro da API:', error); // Debug
        throw new Error(error.error || 'Erro ao atualizar task');
      }

      const data = await response.json();
      console.log('Resposta da API:', data); // Debug
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Deletar task
  async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Resposta da API:', data);
        throw new Error(data.error || 'Erro ao deletar task');
      }

      console.log('Task deletada com sucesso:', data);
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }
};