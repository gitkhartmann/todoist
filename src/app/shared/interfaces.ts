export interface TaskTableItem {
    id: number;
    priority: 'Высокий' | 'Средний' | 'Низкий';
    date: Date;
    category: string;
    description: string;
  }