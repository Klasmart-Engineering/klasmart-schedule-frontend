import { ApolloClient } from "@apollo/client";
import { AudioVision } from "@components/AuduiVision/AudioVision";
import { useAudioMetadata, useDownloadMedia } from "kidsloop-media-ui";
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
  const { loading, error, mediaMetadata } = useAudioMetadata({
    userId,
    roomId,
    h5pId,
    h5pSubId: h5pSubId ? h5pSubId : undefined,
  });
  if (error) {
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!mediaMetadata?.length) return <p>no data</p>;
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
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
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
