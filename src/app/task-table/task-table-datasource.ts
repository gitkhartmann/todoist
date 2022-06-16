import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TaskTableItem {
  id: number;
  priority: 'Высокий' | 'Средний' | 'Низкий';
  date: Date;
  category: string;
  description: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: TaskTableItem[] = [
  {priority: 'Высокий', id: 1, date: new Date(), category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: 2,  date: new Date(), category: 'Отдых', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: 3, date: new Date(), category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: 4, date: new Date(), category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: 5, date: new Date(), category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: 6, date: new Date(), category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: 7, date: new Date(), category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: 8, date: new Date(), category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: 9, date: new Date(), category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: 10, date: new Date(), category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: 11, date: new Date(), category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: 12, date: new Date(), category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: 13, date: new Date(), category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: 14, date: new Date(), category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: 15, date: new Date(), category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: 16, date: new Date(), category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: 17, date: new Date(), category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: 18, date: new Date(), category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: 19, date: new Date(), category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: 20, date: new Date(), category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
];

/**
 * Data source for the TaskTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TaskTableDataSource extends DataSource<TaskTableItem> {
  data: TaskTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TaskTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TaskTableItem[]): TaskTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TaskTableItem[]): TaskTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'priority': return compare(a.priority, b.priority, isAsc);
        case 'date': return compare(+a.date, +b.date, isAsc);
        case 'category': return compare(a.category, b.category, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
