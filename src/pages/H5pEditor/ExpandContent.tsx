import React, { useMemo } from "react";
import { ContentFileType, ContentTypeList } from "../../api/type";
import H5pFile from "../../assets/icons/h5p_file.svg";
import H5pHeader from "./H5pHeader";
import H5pHeaderNavbar from "./H5pHeaderNavBar";
import H5pInfo from "./H5pInfo";
import H5pList, { assetsData } from "./H5pList";
import { MockData } from "./types/index";

interface ExpandContentProps {
  value: string | undefined;
  assetLibraryId?: ContentFileType;
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
  onChangeAssetLibraryId?: (value: ContentFileType) => any;
  expand: boolean;
  onExpand: (value: boolean) => any;
}

const libraryId2Title = (
  id: ExpandContentProps["value"],
  assetLibraryId: ExpandContentProps["assetLibraryId"],
  contentTypeList?: ContentTypeList
) => {
  if (assetLibraryId) {
    const assessInfo = assetsData.find((item) => item.id === assetLibraryId);
    return assessInfo?.title || "";
  } else if (id) {
    const info = contentTypeList?.find((item) => item.id === id?.split(" ")[0]);
    return info?.title || "";
  } else return "";
};

export default function ExpandContent(props: ExpandContentProps) {
  const { value: libraryId, contentTypeList, onChange, expand, onExpand, assetLibraryId, onChangeAssetLibraryId } = props;

  const libraryTitle = useMemo(() => libraryId2Title(libraryId, assetLibraryId, contentTypeList), [
    libraryId,
    assetLibraryId,
    contentTypeList,
  ]);
  const [newList, setNewList] = React.useState<ContentTypeList>(contentTypeList);
  const [show, setShow] = React.useState("list");
  const [h5pId, setH5pId] = React.useState<string>("");
  const data: MockData = {
    icon: H5pFile,
    title: "this is image",
    owner: "Fake Owner",
    example: "",
    screenshots: [],
    license: {
      attributes: {},
    },
    description: "this is an amazing file",
    id: ContentFileType.image,
    summary: "this is an amazing file",
  };

  const [mockData, setMockData] = React.useState(data);

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
          libraryId={libraryId}
          assetLibraryId={assetLibraryId}
          setH5pId={setH5pId}
          onChange={onChange}
          onChangeAssetLibraryId={onChangeAssetLibraryId}
          contentTypeList={newList}
          onExpand={onExpand}
          expand={expand}
          setShow={setShow}
          setMockData={setMockData}
        />
      </>
    ) : (
      <H5pInfo mockData={mockData} setShow={setShow} contentTypeList={contentTypeList} h5pId={h5pId} />
    );

  return (
    <div>
      <H5pHeaderNavbar title={libraryTitle ?? ""} onExpand={onExpand} expand={expand} />
      {expand && headerTogglePart}
    </div>
  );
}
