import React, { forwardRef, Fragment, useReducer } from "react";
import { apiResourcePathById } from "../../api/extra";
import { ContentType } from "../../api/type";
import docImg from "../../assets/icons/doc.svg";
import materialImg from "../../assets/icons/material.svg";
import audioImg from "../../assets/icons/music.svg";
import imageImg from "../../assets/icons/pic.svg";
import planImg from "../../assets/icons/plan.svg";
import videoImg from "../../assets/icons/video.svg";

const type2svg = {
  [ContentType.image]: imageImg,
  [ContentType.video]: videoImg,
  [ContentType.audio]: audioImg,
  [ContentType.doc]: docImg,
  [ContentType.plan]: planImg,
  [ContentType.assets]: imageImg,
  [ContentType.material]: materialImg,
};

interface ThumbnailProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  id?: string;
  type?: ContentType;
}
export const Thumbnail = forwardRef<HTMLImageElement, ThumbnailProps>((props, ref) => {
  const { type = ContentType.material, id } = props;
  const [loaded, dispatchLoaded] = useReducer(() => true, false);
  const thumbail = id && apiResourcePathById(id);
  const defaultThumbail = type2svg[type];
  const display = loaded ? "inline-block" : "none";

  return (
    <Fragment>
      {!loaded && <img {...props} ref={!loaded ? ref : null} alt="thumbail" src={defaultThumbail} />}
      <img {...props} ref={loaded ? ref : null} alt="thumbail" src={thumbail} onLoad={dispatchLoaded} style={{ display }} />
    </Fragment>
  );
});
