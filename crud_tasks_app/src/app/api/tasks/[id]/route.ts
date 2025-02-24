import { NextResponse } from 'next/server';
import { Task } from '@/data/model/Task';
import { database } from '@/data/database';

// GET - Buscar task específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || isNaN(Number(params.id))) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const task = database.getTasks().find((t: Task) => t.id === Number(params.id));
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Erro ao buscar task:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar task' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar task
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = await params.id;
      
      if (!id || isNaN(Number(id))) {
        return NextResponse.json(
          { error: 'ID inválido' },
          { status: 400 }
        );
      }
  
      const taskId = Number(id);
      const body = await request.json();
      
      console.log('Task ID procurado:', taskId);
      console.log('Dados recebidos:', body);
      console.log('Database atual:', database.getTasks());
  
      const taskIndex = database.getTasks().findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return NextResponse.json(
          { error: 'Task não encontrada' },
          { status: 404 }
        );
      }
  
      const updatedTask: Task = {
        ...database.getTasks()[taskIndex],
        ...body,
        id: taskId,
      };
  
      database.getTasks()[taskIndex] = updatedTask;
      return NextResponse.json(updatedTask);
    } catch (error) {
      console.error('Erro ao atualizar task:', error);
      return NextResponse.json(
        { error: 'Erro interno ao atualizar task' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Iniciando deleção, estado atual:', database.getTasks());
    
    const id = params.id;
    console.log('ID recebido:', id);

    if (!id || isNaN(Number(id))) {
      console.error('ID inválido:', id);
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const taskId = Number(id);
    const taskIndex = database.getTasks().findIndex(t => t.id === taskId);
    
    console.log('Índice encontrado:', taskIndex);
    console.log('Tasks disponíveis:', database.getTasks());

    if (taskIndex === -1) {
      console.error('Task não encontrada:', taskId);
      return NextResponse.json(
        { error: 'Task não encontrada' },
        { status: 404 }
      );
    }

    const deletedTask = database.getTasks().splice(taskIndex, 1)[0];
    console.log('Task removida:', deletedTask);
    console.log('Novo estado:', database.getTasks());

    return NextResponse.json({ 
      success: true,
      message: 'Task removida com sucesso',
      task: deletedTask 
    });
  } catch (error) {
    console.error('Erro ao deletar task:', error);
    return NextResponse.json(
      { error: 'Erro interno ao deletar task' },
      { status: 500 }
    );
  }
}