import { DEFAULT_LENGTH, DEFAULT_PAGE } from '../interfaces/table-consts';
import { TableEventInterface } from '../models/table-data';
import { RouteEventInterface } from '../models/table-data/route-event';

export function paramsFn(event: TableEventInterface, navigation = false): RouteEventInterface {
  const length = event.rows || DEFAULT_LENGTH;

  const filter = event.filters
    ? Object.keys(event.filters).map((key: string) => ({
      scope: key,
      operator: event.filters[key].matchMode,
      value: event.filters[key].value,
      type: event.filters[key].type ?? 'string',
    })).filter(f => typeof f.value === 'string'
      ? f.value.trim() !== ''
      : f.value !== null)
    : null;

  return {
    params: {
      ...(length !== DEFAULT_LENGTH || !navigation) && {
        length: length,
      },
      ...(!!event.first || !navigation) && {
        page: event.first ? event.first / length + 1 : DEFAULT_PAGE,
      },
      ...(event.sortField && event.sortField !== 'null') && {
        sort: JSON.stringify([{
            scope: event.sortField,
            value: event.sortOrder === 1 ? 'asc' : 'desc',
          }],
        ),
      },
      ...filter?.length && {
        filter: JSON.stringify(filter),
      },
    },
  };
}
