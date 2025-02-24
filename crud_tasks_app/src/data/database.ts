import { Task } from "./model/Task";

class Database {
  private tasks: Task[] = [];
  private readonly STORAGE_KEY = 'tasks_db';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.tasks = JSON.parse(stored);
          console.log('Dados carregados:', this.tasks);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
        console.log('Dados salvos:', this.tasks);
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    }
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(task: Task): Task {
    this.tasks.push(task);
    this.saveToStorage();
    console.log('Task adicionada:', task);
    console.log('Estado atual:', this.tasks);
    return task;
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveToStorage();
      console.log('Task atualizada:', updatedTask);
    }
    console.log('Estado atual:', this.tasks);
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const deleted = this.tasks.splice(index, 1)[0];
      this.saveToStorage();
      console.log('Task removida:', deleted);
    }
    console.log('Estado atual:', this.tasks);
  }

  getState() {
    return {
      totalTasks: this.tasks.length,
      tasks: [...this.tasks],
      localStorage: typeof window !== 'undefined' 
        ? localStorage.getItem(this.STORAGE_KEY) 
        : 'N/A'
    };
  }
}

// Exporta uma única instância do banco de dados
export const database = new Database();