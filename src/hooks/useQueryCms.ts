import { OutcomeListExectSearch } from "@pages/OutcomeList/types";
import { updateURLSearch } from "@utilities/urlUtilities";
import { useLocation } from "react-router-dom";

const useQueryCms = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") || "";
  const searchMedia = query.get("searchMedia") || "";
  const searchOutcome = query.get("searchOutcome") || "";
  //const assumed = (query.get("assumed") || "") === "true" ? true : false;
  const isShare = query.get("isShare") || "org";
  const editindex = Number(query.get("editindex") || 0);
  const back = query.get("back") || "";
  const exactSerch = query.get("exactSerch") || "all";
  const parent_folder = query.get("parent_id") || "";
  const exect_search = query.get("exect_search") || OutcomeListExectSearch.all;
  const search_key = query.get("search_key") || "";
  const assumed = query.get("assumed") === "true";
  const page = Number(query.get("page")) || 1;
  const first = query.get("first_save");
  const first_save = query.get("first_save") === "true";
  const is_unpub = query.get("is_unpub") || "";
  const updateQuery = (param: { [key: string]: string | number | boolean }): string => {
    return updateURLSearch(search, param);
  };
  return {
    id,
    searchMedia,
    searchOutcome,
    search,
    editindex,
    assumed,
    isShare,
    back,
    exactSerch,
    parent_folder,
    exect_search,
    search_key,
    page,
    first,
    first_save,
    is_unpub,
    updateQuery,
  };
};

export default useQueryCms;
