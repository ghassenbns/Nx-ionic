export function getParam(urlParams: string): any {
  const params = new URLSearchParams(urlParams);
  const sort = params.getAll('sort');
  const filter = params.getAll('filter');
  const length = params.getAll('length');
  const page = params.getAll('page');

  return  {
    ...sort.length && { sort: sort[0] },
    ...filter.length && { filter: filter[0] },
    ...length.length && { length: length[0] },
    ...page.length && { page: page[0] },
  };
}
