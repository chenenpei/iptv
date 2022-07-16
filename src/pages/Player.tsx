import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useParams, useLocation } from "react-router";
import "./Player.css";
import { useEffect, useMemo, useRef, useCallback } from "react";

import "video.js/dist/video-js.css";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const VideoJS = (props: {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [onReady, options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

const Player: React.FC = () => {
  const params = useParams<{ name?: string }>();
  const query = useQuery();
  const playerRef = useRef(null);

  const url = useMemo(() => atob(query.get("url") || ""), [query]);
  const videoJsOptions = useMemo(
    () => ({
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
    }),
    [url]
  );

  const handlePlayerReady = useCallback((player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  }, []);

  return (
    <IonPage className="page-player">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            {params.name ? decodeURIComponent(params.name) : "Player"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isPlatform("ios") ? (
          <div className="player-main-card">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
        ) : (
          <IonCard className="player-main-card">
            <IonCardContent>
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Player;
