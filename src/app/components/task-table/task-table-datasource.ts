/*import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { ITask } from '../../shared/interfaces';
import { TaskService } from 'src/app/services/task.service';

/**
 * Data source for the TaskTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
/*
export class TaskTableDataSource extends DataSource<ITask> {
  data: ITask[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   *//*
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
  /*
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  /*
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
  /*
  private getSortedData(data: ITask[]): ITask[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'dateEnd': return (+new Date(a.range.end) < +new Date(b.range.end) ? -1 : 1) * (isAsc ? 1 : -1);
        case 'dateStart': return (+new Date(a.range.start) < +new Date(b.range.start) ? -1 : 1) * (isAsc ? 1 : -1);
        case 'priority': return (a.priority.toLowerCase() < b.priority.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1);
        case 'category': return (a.category.toLowerCase() < b.category.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1);
        default: return 0;
      }
    });
  }
}

/* Simple sort comparator for example ID/Name columns (for client-side sorting). 
function compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

 case 'priority': return compare(a.priority.toLowerCase(), b.priority.toLowerCase(), isAsc);
        case 'dateEnd': return compare(+new Date(a.range.end), +new Date(b.range.end), isAsc);
        case 'dateStart': return compare(+new Date(a.range.start), +new Date(b.range.start), isAsc);
        case 'category': return compare(a.category.toLowerCase(), b.category.toLowerCase(), isAsc);

*/
