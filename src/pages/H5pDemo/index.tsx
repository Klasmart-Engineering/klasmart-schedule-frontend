import React from "react";
import mockMultichoiceContent from '../../mocks/multichoiceContent.json';
import { H5pPlayer } from "./H5pPlayer";

export function H5pDemo() {
  return (
    <H5pPlayer libraryId={'H5P.MultiChoice-1.14'} content={mockMultichoiceContent}/>
  );
}

H5pDemo.routeBasePath = "/H5pDemo";
H5pDemo.routeRedirectDefault = `/H5pDemo`;