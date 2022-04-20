import { ApolloClient } from "@apollo/client";
import { AudioVision } from "@components/AuduiVision/AudioVision";
import { useAudioMetadata, useDownloadMedia } from "@kl-engineering/kidsloop-media-hooks";
import { d } from "@locale/LocaleManager";
import React from "react";
interface AudioViewProps {
  userId: string;
  roomId: string;
  h5pId: string;
  h5pSubId?: string;
  client: ApolloClient<unknown>;
  resourceType: string;
}

export const AudioView = ({ userId, roomId, h5pId, h5pSubId, resourceType }: AudioViewProps) => {
  const isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 0;
  const { loading, error, mediaMetadata } = useAudioMetadata({
    userId,
    roomId,
    h5pId,
    h5pSubId: h5pSubId ? h5pSubId : undefined,
  });
  if (isSafari) return <p>{d("Please use another browser (Chrome) for a better experience.").t("assessment_audio_suggest_browser")}</p>;
  if (error) {
    return <p>{d("Server request failed").t("general_error_unknown")}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!mediaMetadata?.length) return <p>{d("Audio data is not successfully stored by student.").t("assessment_audio_no_data")}</p>;
  return (
    <AudioPlayerV2
      resourceType={resourceType}
      writtenText={mediaMetadata[0].description}
      audioId={mediaMetadata[0].id}
      mimeType={mediaMetadata[0].mimeType ? mediaMetadata[0].mimeType : "audio/webm"}
      roomId={roomId as string}
    />
  );
};

interface AudioPlayerProps {
  audioId: string;
  roomId: string;
  mimeType: string;
  client?: ApolloClient<unknown>;
  resourceType: string;
  writtenText?: string;
}
export const AudioPlayerV2 = ({ audioId, roomId, mimeType, client, resourceType, writtenText }: AudioPlayerProps) => {
  const {
    loading,
    error,
    src: audioSrc,
  } = useDownloadMedia({
    mediaId: audioId,
    roomId,
    mimeType,
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>{d("Server request failed").t("general_error_unknown")}</p>;
  }
  return (
    <div>
      <AudioVision
        src={audioSrc as string}
        bars={32}
        barColor={["#6B9AF6", "#61C2CD", "#B499F7", "#BDD2F7"]}
        height={150}
        width={350}
        volume={0.6}
      />
      {resourceType !== "AudioRecorder" && writtenText && <div>{writtenText}</div>}
    </div>
  );
};

export default AudioView;
