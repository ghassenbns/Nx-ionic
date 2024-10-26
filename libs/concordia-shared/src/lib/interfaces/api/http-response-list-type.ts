export interface HttpResponseListType<T> {
  status: string | number;
  data: T[];
}
