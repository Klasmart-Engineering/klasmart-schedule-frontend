import { ApolloClient, ApolloProvider } from "@apollo/client";
import { AudioPlayer, useAudioMetadata, useDownloadAudio } from "kidsloop-audio-player";
interface AudioViewProps {
  userId: string;
  roomId: string;
  h5pId: string;
  h5pSubId?: string;
  client: ApolloClient<unknown>;
}

export const AudioView = ({ userId, roomId, h5pId, h5pSubId, client }: AudioViewProps) => {
  // const link = createHttpLink({
  //   uri: `${process.env.REACT_APP_KO_BASE_API}/audio-storage/graphql/`,
  //   credentials: 'include',
  // })
  // const client = new ApolloClient({
  //   link,
  //   cache: new InMemoryCache(),
  // })
  const { loading, error, audioMetadata } = useAudioMetadata({
    userId,
    roomId,
    h5pId,
    h5pSubId,
  });
  if (error) {
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
  }
  if (loading) return <p>Loading ...</p>;
  if (!audioMetadata?.length) return <p>no data</p>;
  return (
    // <ApolloProvider client={client}>
    <>
      <AudioPlayer audioId={audioMetadata?.[0]?.id} mimeType={audioMetadata?.[0]?.mimeType ?? "audio/webm"} roomId={roomId as string} />
      {/* <h1>Audio ID: {audioMetadata?.[0]?.id ?? 'none'}!</h1> */}
    </>
    //  </ApolloProvider>
  );
};

interface AudioPlayerProps {
  audioId: string;
  roomId: string;
  mimeType: string;
  client: ApolloClient<unknown>;
}
export const AudioPlayerV2 = ({ audioId, roomId, mimeType, client }: AudioPlayerProps) => {
  // const link = createHttpLink({
  //   uri: `${process.env.REACT_APP_KO_BASE_API}/audio-storage/graphql/`,
  //   credentials: "include",
  // });
  // const client = new ApolloClient({
  //   link,
  //   cache: new InMemoryCache(),
  // });
  const { loading, error, audioSrc } = useDownloadAudio({
    audioId,
    roomId,
    mimeType,
  });
  console.log(audioSrc);
  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>error: {JSON.stringify(error, null, 2)}</p>;
  }
  return (
    <ApolloProvider client={client}>
      <audio src={audioSrc} controls controlsList="nodownload" />
      {/* <AudioPlayer aus /> */}
    </ApolloProvider>
  );
};

export default AudioView;
