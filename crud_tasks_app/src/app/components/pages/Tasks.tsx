"use client";

import { TaskTable } from "@/app/components/tables/TaskTable";
import { useTask } from "@/contexts/TaskContext";
import { motion } from "framer-motion";

export default function Tasks() {
  const { tasks, loading, error } = useTask();

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto py-12 flex flex-col items-center justify-center"
      >
        <div className="w-16 h-16 relative">
          <div className="animate-ping absolute h-16 w-16 rounded-full bg-orange-400 opacity-20"></div>
          <svg className="animate-spin h-16 w-16 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg text-gray-600 font-medium"
        >
          Carregando tarefas...
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100px' }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-1 bg-orange-200 rounded-full mt-3 overflow-hidden"
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-orange-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto py-8 px-4"
      >
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center">
            <svg className="h-8 w-8 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold mb-1">Ocorreu um erro</h3>
              <p>{error}</p>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-all duration-200 flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar novamente
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <TaskTable tasks={tasks} />
    </motion.div>
  );
}