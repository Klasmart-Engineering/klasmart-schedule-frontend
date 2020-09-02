import React, { ChangeEvent, forwardRef } from "react";
import { ContentType } from "../../api/api.d";
import { apiResourcePathById } from "../../api/extra";
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
  [ContentType.material]: materialImg,
};

interface ThumbnailProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  id?: string;
  type?: ContentType;
}
export const Thumbnail = forwardRef<HTMLImageElement, ThumbnailProps>((props, ref) => {
  const { type = ContentType.material, id } = props;
  const thumbail = id ? apiResourcePathById(id) : type2svg[type];
  return (
    <img
      {...props}
      ref={ref}
      alt="thumbail"
      src={thumbail}
      onError={(e: ChangeEvent<HTMLImageElement>) => {
        // todo: 不要直接操作 dom
        e.target.src = type2svg[type];
      }}
    />
  );
});
