export interface Task {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    completedAt?: string;
    status: 'pendente' | 'em_andamento' | 'concluída';
  }

