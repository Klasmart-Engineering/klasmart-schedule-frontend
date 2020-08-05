import React, { Fragment } from "react";
import Header from "./Header";
import { useParams, useHistory } from "react-router-dom";
import ContentTabs from "./ContentTabs";
import ContentH5p from "./ContentH5p";
import LayoutPair from "./Layout";
import Details from "./Details";
import Outcomes from "./Outcomes";
import MediaAssets from "./MediaAssets";

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
  return (
    <Fragment>
      <Header lesson={lesson} onChangeLesson={handleChangeLesson} />
      <LayoutPair
        breakpoint="md"
        leftWidth={703}
        rightWidth={1105}
        spacing={32}
        basePadding={0}
        padding={40}
      >
        <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
          <Details />
          <Outcomes />
          <MediaAssets />
        </ContentTabs>
        <ContentH5p />
      </LayoutPair>
    </Fragment>
  );
}

ContentEdit.routeBasePath = "/content-edit";
ContentEdit.routeMatchPath = "/content-edit/lesson/:lesson/tab/:tab";
ContentEdit.routeRedirectDefault = "/content-edit/lesson/material/tab/details";
