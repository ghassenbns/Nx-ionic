import { HttpRecordType } from '../../interfaces/api/http-record-type';

export interface TableInputDataInterface<T> extends HttpRecordType<T> {
  data: T[];
}
