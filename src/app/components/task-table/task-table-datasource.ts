import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { ITask } from '../../shared/interfaces';



// TODO: replace this with real data from your application
const EXAMPLE_DATA: ITask[] = [
  {priority: 'Высокий', id: '1', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: '2',  range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '3', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '4', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: '5', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '6', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '7', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '8', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '9', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: '10', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '11', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: '12', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '13', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '14', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '15', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '16', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '17', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '18', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '19', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '20', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
];

/**
 * Data source for the TaskTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TaskTableDataSource extends DataSource<ITask> {
  data: ITask[] = EXAMPLE_DATA;
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
  connect(): Observable<ITask[]> {
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
  private getPagedData(data: ITask[]): ITask[] {
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
  private getSortedData(data: ITask[]): ITask[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'priority': return compare(a.priority, b.priority, isAsc);
        case 'date': return compare(+a.range.end, +b.range.end, isAsc);
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
