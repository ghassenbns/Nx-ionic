import { TablePaginationInterface } from '../../models/table-data';
import { HttpResponseListType } from './http-response-list-type';

export interface HttpRecordType<T> extends HttpResponseListType<T> {
  pagination: TablePaginationInterface;
}
