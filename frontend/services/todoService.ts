import { apiClient } from './api';

export const todoService = {
  async getTodos() {
    const res = await apiClient<any>('/todos?perPage=50');
    return res.data || [];
  },
  async getTodoById(id: number | string) {
    const res = await apiClient<any>(`/todos/${id}`);
    return res.data;
  },
  async createTodo(payload: any) {
    const task = typeof payload === 'string' ? payload : payload.todo;
    const res = await apiClient<any>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
    return res.data;
  },
  async updateTodo(id: number | string, payload: any) {
    await apiClient(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async deleteTodo(id: number | string) {
    await apiClient(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
};
