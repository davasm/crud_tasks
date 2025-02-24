import { NextResponse } from 'next/server';
import { Task } from '@/data/model/Task';
import { database } from '@/data/database';

// Array global para armazenar as tasks (temporário)
const tasks: Task[] = [];

// GET - Listar todas as tasks
export async function GET() {
  try {
    return NextResponse.json(database.getTasks());
  } catch (error) {
    console.error('Erro ao listar tasks:', error);
    return NextResponse.json(
      { error: 'Erro ao listar tasks' },
      { status: 500 }
    );
  }
}

// POST - Criar nova task
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação dos campos obrigatórios
    if (!body.title || !body.description || !body.status) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Criar nova task com campos calculados
    const newTask: Task = {
      id: Date.now(), // Usar timestamp como ID temporário
      title: body.title,
      description: body.description,
      status: body.status,
      createdAt: new Date().toISOString(),
      completedAt: body.status === 'concluída' ? new Date().toISOString() : undefined
    };

    const createdTask = database.addTask(newTask);
    console.log('Task criada:', createdTask);
    
    database.addTask(newTask);
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar task:', error);
    return NextResponse.json(
      { error: 'Erro ao criar task' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar task existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID da task é obrigatório' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(t => t.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task não encontrada' },
        { status: 404 }
      );
    }

    // Atualiza a task mantendo campos originais e atualizando o completedAt se necessário
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...body,
      completedAt: body.status === 'concluída' 
        ? body.completedAt || new Date().toISOString()
        : undefined
    };

    tasks[taskIndex] = updatedTask;
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Erro na atualização:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar task' },
      { status: 500 }
    );
  }
}