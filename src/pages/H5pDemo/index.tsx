import React from "react";
import mockContent from '../../mocks/ArithmeticQuizContent.json';
import { H5pPlayer } from "./H5pPlayer";

export function H5pDemo() {
  return (
    <H5pPlayer value={mockContent}/>
  );
}

H5pDemo.routeBasePath = "/H5pDemo";
H5pDemo.routeRedirectDefault = `/H5pDemo`;