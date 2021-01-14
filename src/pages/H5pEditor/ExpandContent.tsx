import React from "react";
import { ContentTypeList } from "../../api/type";
import { H5PSchema } from "../../models/ModelH5pSchema";
import H5pHeader from "./H5pHeader";
import H5pHeaderNavbar from "./H5pHeaderNavBar";
import H5pInfo from "./H5pInfo";
import H5pList from "./H5pList";

interface ExpandContentProps {
  contentType: string;
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
  setContentType: (value: string) => any;
  schema: H5PSchema;
  expand: boolean;
  setExpand: (value: boolean) => any;
}

export default function ExpandContent(props: ExpandContentProps) {
  const { contentType, contentTypeList, onChange, setContentType, schema, expand, setExpand } = props;

  const [newList, setNewList] = React.useState<ContentTypeList>(contentTypeList);
  const [show, setShow] = React.useState("list");
  const [h5pId, setH5pId] = React.useState<string>("");

  React.useEffect(() => {
    setNewList(contentTypeList);
  }, [contentTypeList]);

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
    const result = contentTypeList.filter((item: any) => item.title.toLowerCase().includes(value.toLowerCase()));
    setNewList(result);
  };

  const headerTogglePart =
    show === "list" ? (
      <>
        <H5pHeader contentTypeList={newList} sortList={sortList} searchChange={searchChange} />
        <H5pList
          setH5pId={setH5pId}
          onChange={onChange}
          contentTypeList={newList}
          setContentType={setContentType}
          schema={schema}
          setExpand={setExpand}
          expand={expand}
          setShow={setShow}
        />
      </>
    ) : (
      <H5pInfo setShow={setShow} contentTypeList={contentTypeList} h5pId={h5pId} />
    );

  return (
    <div>
      <H5pHeaderNavbar contentType={contentType} setExpand={setExpand} expand={expand} />
      {expand && headerTogglePart}
    </div>
  );
}
