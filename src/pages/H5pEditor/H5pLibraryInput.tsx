import React from "react";
import { ContentTypeList } from "../../api/type";
import H5pHeader from "./H5pHeader";
import H5pList from "./H5pList";

export interface H5pLibraryInputProps {
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
}

export function H5pLibraryInput(props: H5pLibraryInputProps) {
  const { contentTypeList, onChange } = props;
  const [newList, setNewList] = React.useState(contentTypeList);

  const sortList = (type: string) => {
    if (type === "popularFirst") {
      const result = contentTypeList.sort((a: any, b: any) => b["popularity"] - a["popularity"]);
      setNewList(JSON.parse(JSON.stringify(result)));
    }
    if (type === "NewestFirst") {
      const result = contentTypeList.sort((a: any, b: any) => new Date(b["createdAt"]).valueOf() - new Date(a["createdAt"]).valueOf());
      setNewList(JSON.parse(JSON.stringify(result)));
    }
    if (type === "aToZ") {
      const result = contentTypeList.sort((a: any, b: any) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      setNewList(JSON.parse(JSON.stringify(result)));
    }
  };

  const searchChange = (value: string) => {
    const result = contentTypeList.filter((item) => item.title.includes(value));
    setNewList(result);
  };

  return (
    <div>
      {/* <button onClick={() => onChange("H5P.MultiChoice-1.14")}>select library: H5P.MultiChoice-1.14</button> */}
      {/* <pre>{JSON.stringify(contentTypeList, null, 2)}</pre> */}
      <H5pHeader contentTypeList={newList} sortList={sortList} searchChange={searchChange} />
      <H5pList contentTypeList={newList} onChange={onChange} />
    </div>
  );
}
