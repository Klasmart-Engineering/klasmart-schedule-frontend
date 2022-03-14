import { ApolloClient } from "@apollo/client";
import { AudioVision } from "@components/AuduiVision/AudioVision";
import { createStyles, makeStyles, Slider } from "@material-ui/core";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@material-ui/icons/PlayCircleFilledOutlined";
import { useAudioMetadata, useDownloadMedia } from "kidsloop-media-ui";
import React, { useEffect, useRef, useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    progress: {
      flex: 1,
      marginLeft: "10px",
      marginRight: "10px",
      color: "#0E78D5",
    },
    itemTool: {
      cursor: "pointer",
      color: "#0E78D5",
    },
    tools: {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
    },
  })
);
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
    h5pSubId,
  });
  if (error) {
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!mediaMetadata?.length) return <p>no data</p>;
  return (
    <AudioPlayerV2 resourceType={resourceType} writtenText={mediaMetadata?.[0].description}  audioId={mediaMetadata?.[0]?.id} mimeType={mediaMetadata?.[0]?.mimeType ?? "audio/webm"} roomId={roomId as string} />
  );
};

interface AudioPlayerProps {
  audioId: string;
  roomId: string;
  mimeType: string;
  client?: ApolloClient<unknown>;
  resourceType: string;
  writtenText?: string
}
export const AudioPlayerV2 = ({ audioId, roomId, mimeType, client, resourceType, writtenText }: AudioPlayerProps) => {
  const css = useStyles();
  const [value, setValue] = useState<number>(0);
  const [isplay, setIsplay] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [usePlay, setUsePlay] = useState<boolean>(false);
  const [useResume, setUseResume] = useState<boolean>(false);
  const handleChange = (event: any, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    setValue(newValue as number);
    if(audioRef.current?.currentTime === 0 && newValue !== 0) {
      setUsePlay(true)
    } else {
      setUsePlay(false)
    }
    if (!Number.isFinite(audio.duration)) {
      audio.currentTime = Number.MAX_SAFE_INTEGER;
      audio.currentTime = 0;
    } else {
      audio.currentTime = audio.duration * (newValue as number) * 0.01;
      setCurrent(audio.currentTime);
    }
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsplay(!isplay);
    if(!isplay && audio.currentTime === audio.duration) {
      setUseResume(true)
    } else {
      setUseResume(false)
    }
    isplay ? audio.pause() : audio.play();
    
  };
  const audioRef = useRef<HTMLAudioElement>(null);
  const { loading, error, src: audioSrc } = useDownloadMedia({
    mediaId: audioId,
    roomId,
    mimeType,
  });
  // const src2 = "https://golb-1256296192.cos.ap-shanghai.myqcloud.com/1.mp3"
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timer = setInterval(() => {
      if (!Number.isFinite(audio.duration)) {
        audio.currentTime = Number.MAX_SAFE_INTEGER;
        audio.currentTime = current;
      } else {
        if (audio.currentTime === audio.duration) {
          setIsplay(false);
        }
        isplay ? setValue((audio.currentTime / audio.duration) * 100) : clearInterval(timer);
      }
    }, 50);
    return () => {
      clearInterval(timer);
    };
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
  }
  return (
    <div>
      <AudioVision
        start={audioRef.current?.currentTime as number}
        src={audioSrc as string}
        bars={32}
        barColor={["#6B9AF6", "#61C2CD", "#B499F7", "#BDD2F7"]}
        height={150}
        width={350}
        pause={!isplay}
        volume={0.6}
        usePlay={usePlay}
        useResume={useResume}
      />
      <div className={css.tools}>
        <Slider className={css.progress} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        {isplay ? (
          <PauseCircleFilledIcon className={css.itemTool} onClick={handlePlay} />
        ) : (
          <PlayCircleFilledOutlinedIcon className={css.itemTool} onClick={handlePlay} />
        )}
      </div>
      {
        resourceType !== "AudioRecorder" && writtenText &&
          (<div>
            {writtenText}
          </div>)
      }
      <audio src={audioSrc} controlsList="nodownload" ref={audioRef} />
    </div>
  );
};

export default AudioView;
