import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import BriefIntroduction from "./BriefIntroduction";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const category = query.get("category");
    return clearNull({ category });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export default function Report() {
  const condition = useQuery();
  const history = useHistory();

  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  return (
    <>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <BriefIntroduction />
    </>
  );
}

Report.routeBasePath = "/report/index";
Report.routeRedirectDefault = `/report/index?category=${Category.archived}`;
