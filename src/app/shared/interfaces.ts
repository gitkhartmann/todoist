export interface Task {
    id?: string;
    priority: string;
  range: {
    end: string;
    start: string;
    };
    category: string;
    description: string;
  }