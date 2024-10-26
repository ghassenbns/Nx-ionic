export interface HttpResponseEntityType<T> {
  status: string | number;
  data: T;
}
