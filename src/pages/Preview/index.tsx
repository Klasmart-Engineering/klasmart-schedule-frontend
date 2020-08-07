import React, { Fragment } from "react";
import Content from "./Content";
import { useLocation } from "react-router";

const useModel = () => {
  const { search } = useLocation();
  const model = new URLSearchParams(search).get("model") || "default";
  return model;
};

export default function Preview() {
  const model = useModel();
  return (
    <Fragment>
      <Content model={model} />
    </Fragment>
  );
}

Preview.routeBasePath = "/preview";
