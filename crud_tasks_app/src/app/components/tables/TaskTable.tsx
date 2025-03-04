import { PlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TASK_TABLE_HEAD } from "@/data/constants/TableHeaders";
import { Task } from "@/data/model/Task";
import { useTask } from "@/contexts/TaskContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showError, setShowError] = useState(false);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <AnimatePresence>
        {showError && error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <button 
              onClick={() => setShowError(false)} 
              className="text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-white">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="h-7 w-7 text-orange-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Lista de Tarefas
            </h1>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex w-full shrink-0 gap-4 md:w-max"
          >
            <div className="w-full md:w-72 relative group">
              <input
                type="text"
                placeholder="Buscar tarefa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-orange-500 transition-colors duration-300" />
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/create"
                className={`flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <PlusIcon className="h-5 w-5" />
                Nova Tarefa
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-rounded-lg">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex">
              {TASK_TABLE_HEAD.map((header, index) => (
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  key={`header-${header.head}`} 
                  className="flex-1 p-4 text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {header.head}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div>
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-12 text-center text-gray-500"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">Nenhuma tarefa encontrada</p>
                <p className="text-sm mt-1">Tente ajustar sua busca ou crie uma nova tarefa</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div 
                    key={`task-${task.id}-${task.createdAt}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    className="flex border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1 p-4 text-sm text-gray-900">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-4 text-sm font-medium text-gray-900">
                      {task.title}
                    </div>
                    <div className="flex-1 p-4 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
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
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </motion.span>
                    </div>
                    <div className="flex-1 p-4 flex justify-start">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(219, 234, 254, 1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(task)}
                        disabled={loading}
                        className={`p-2 text-orange-600 hover:bg-blue-50 rounded-full transition-all duration-200 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Editar"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.50001C19.3284 1.67158 20.6716 1.67158 21.5 2.50001C22.3284 3.32844 22.3284 4.67157 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    </div>
                    <div className="flex-1 p-4 flex justify-start">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(254, 226, 226, 1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(task.id)}
                        disabled={loading || isDeleting === task.id}
                        className={`p-2 text-orange-600 hover:bg-red-50 rounded-full transition-all duration-200 ${
                          loading || isDeleting === task.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Excluir"
                      >
                        {isDeleting === task.id ? (
                          <svg className="animate-spin h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}