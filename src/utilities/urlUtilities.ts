export const updateURLSearch = (
  search: string,
  param: {
    [key: string]: string | number | boolean;
  }
): string => {
  const query = new URLSearchParams(search);
  Object.keys(param).forEach((key) => {
    query.set(key, `${param[key]}`);
  });
  return query.toString();
};
