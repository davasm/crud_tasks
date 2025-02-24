import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TASK_TABLE_HEAD } from "@/data/constants/TableHeaders";
import { Task } from "@/data/model/Task";
import { useTask } from "@/contexts/TaskContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TaskTableProps {
  tasks: Task[];
}

const getStatusColor = (status: Task['status']) => {
  const colors = {
    'pendente': 'bg-gray-100 text-gray-800',
    'em_andamento': 'bg-blue-100 text-blue-800',
    'concluída': 'bg-green-100 text-green-800'
  };
  return colors[status] || colors.pendente;
};

export function TaskTable({ tasks }: TaskTableProps) {
  const router = useRouter();
  const { deleteTask, loading } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (task: Task) => {
    if (!loading) {
      router.push(`/create?id=${task.id}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (loading || isDeleting) return;

    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        setIsDeleting(id);
        setError(null);
        await deleteTask(id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar tarefa';
        setError(errorMessage);
        console.error('Erro ao deletar task:', err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md">
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Lista de Tarefas
            </h1>
          </div>
          <div className="flex w-full shrink-0 gap-4 md:w-max">
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Buscar tarefa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Link
              href="/create"
              className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <PlusIcon className="h-5 w-5" />
              Nova Tarefa
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="bg-gray-50 border-b">
            <div className="flex">
              {TASK_TABLE_HEAD.map((header) => (
                <div 
                  key={`header-${header.head}`} 
                  className="flex-1 p-4 text-sm font-medium text-gray-500"
                >
                  {header.head}
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div>
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhuma tarefa encontrada
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div 
                  key={`task-${task.id}-${task.createdAt}`} 
                  className="flex border-b hover:bg-gray-50"
                >
                  <div className="flex-1 p-4 text-sm text-gray-900">
                    {index + 1}
                  </div>
                  <div className="flex-1 p-4 text-sm text-gray-900">
                    {task.title}
                  </div>
                  <div className="flex-1 p-4 text-sm text-gray-900">
                    {task.description}
                  </div>
                  <div className="flex-1 p-4 text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex-1 p-4 text-sm text-gray-900">
                    {task.completedAt 
                      ? new Date(task.completedAt).toLocaleDateString('pt-BR') 
                      : '-'
                    }
                  </div>
                  <div className="flex-1 p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex justify-center">
                    <button
                      onClick={() => handleEdit(task)}
                      disabled={loading}
                      className={`p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 flex justify-center">
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={loading || isDeleting === task.id}
                      className={`p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors ${
                        loading || isDeleting === task.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Excluir"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}