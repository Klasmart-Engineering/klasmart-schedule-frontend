import React, { Fragment } from "react";
import ContentHeader from "./ContentHeader";
import { useParams, useHistory } from "react-router-dom";
import ContentTabs from "./ContentTabs";
import ContentH5p from "./ContentH5p";
import LayoutPair from "./Layout";
import Details from "./Details";
import Outcomes from "./Outcomes";
import MediaAssets from "./MediaAssets";
import mockList from "../../mocks/contentList.json";
import { Box } from "@material-ui/core";
import MediaAssetsLibraryHeader from "./MediaAssetsLibraryHeader";

export default function ContentEdit() {
  const { lesson, tab } = useParams();
  const history = useHistory();
  const { routeBasePath } = ContentEdit;
  const handleChangeLesson = (lesson: string) => {
    history.push(`${routeBasePath}/lesson/${lesson}/tab/details`);
  };
  const handleChangeTab = (tab: string) => {
    history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}`);
  };
  const assetsLibrary = (
    <Box>
      <MediaAssetsLibraryHeader />
      <MediaAssets list={mockList} library />
    </Box>
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
      <Details />
      <Outcomes />
      <MediaAssets list={mockList} />
    </ContentTabs>
  );
  return (
    <Fragment>
      <ContentHeader lesson={lesson} onChangeLesson={handleChangeLesson} />
      <LayoutPair
        breakpoint="md"
        leftWidth={703}
        rightWidth={1105}
        spacing={32}
        basePadding={0}
        padding={40}
      >
        {tab === "assetsLibrary" ? assetsLibrary : contentTabs}
        <ContentH5p />
      </LayoutPair>
    </Fragment>
  );
}

ContentEdit.routeBasePath = "/content-edit";
ContentEdit.routeMatchPath = "/content-edit/lesson/:lesson/tab/:tab";
ContentEdit.routeRedirectDefault = "/content-edit/lesson/material/tab/details";
