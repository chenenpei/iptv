import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import "./PlayList.css";
import parser, { PlaylistItem } from "iptv-playlist-parser";
import { useCallback, useEffect, useState } from "react";
import { search } from "ionicons/icons";
import { useSearchStore } from "../store";
import ConnectStatus from "../components/ConnectStatus";

const PlayList: React.FC = () => {
  const CHINA_SOURCE = "https://iptv-org.github.io/iptv/countries/cn.m3u";

  const [list, setList] = useState<PlaylistItem[]>([]);
  const [data, setData] = useState<PlaylistItem[]>([]);
  // const [loading, setLoading] = useState(false);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const setSearchList = useSearchStore((state) => state.setList);

  const pushData = useCallback(() => {
    const newData = list.slice(data.length, data.length + 21);
    setData([...data, ...newData]);
  }, [data, list]);

  const loadData = useCallback(
    (ev: any) => {
      setTimeout(() => {
        pushData();
        ev.target.complete();
        if (data.length >= list.length) {
          setInfiniteDisabled(true);
        }
      }, 500);
    },
    [data.length, list.length, pushData]
  );

  const initData = useCallback((list: PlaylistItem[]) => {
    setData(list.slice(0, 21));
  }, []);

  useEffect(() => {
    const getList = async () => {
      // setLoading(true);
      const res = await fetch(CHINA_SOURCE);
      const resText = await res.text();
      const parsed = parser.parse(resText);
      const protomatch = /^(https?|ftp):/;
      const items = parsed.items.map((item) => ({
        ...item,
        url: item.url.replace(protomatch, ""),
      }));
      setList(items);
      setSearchList(items);
      if (data.length === 0) initData(items);
      // setLoading(false);
    };

    getList();
  }, [data.length, initData, setSearchList]);

  return (
    <IonPage className="app-play-list">
      <IonHeader>
        <IonToolbar>
          <IonTitle>IPTV</IonTitle>
          <IonButtons collapse={true} slot="end">
            <IonButton routerLink="/page/list/search">
              <IonIcon
                size={isPlatform("ios") ? "small" : "large"}
                slot="icon-only"
                icon={search}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">IPTV</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/page/list/search">
                <IonIcon slot="icon-only" icon={search} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        {isPlatform("ios") ? (
          <div className="page-main-card">
            <IonList>
              {data.map((item) => (
                <IonItem
                  key={item.url}
                  routerLink={`/page/list/player/${encodeURIComponent(
                    item.name
                  )}?url=${btoa(item.url)}`}
                >
                  <IonThumbnail slot="start">
                    <img
                      className="thumb-nail-img"
                      src={
                        item.tvg.logo
                          ? item.tvg.logo
                          : "https://placehold.jp/24/424242/ffffff/56x56.png?text=TV"
                      }
                      alt={`${item.name}_logo`}
                    />
                  </IonThumbnail>
                  <IonLabel>{item.name}</IonLabel>
                  <ConnectStatus url={item.url} />
                </IonItem>
              ))}
            </IonList>
            <IonInfiniteScroll
              onIonInfinite={loadData}
              disabled={isInfiniteDisabled}
            >
              <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
        ) : (
          <IonCard className="page-main-card">
            <IonCardContent>
              <IonList>
                {data.map((item) => (
                  <IonItem
                    key={item.url}
                    routerLink={`/page/list/player/${encodeURIComponent(
                      item.name
                    )}?url=${btoa(item.url)}`}
                  >
                    <IonThumbnail slot="start">
                      <img
                        className="thumb-nail-img"
                        src={
                          item.tvg.logo
                            ? item.tvg.logo
                            : "https://placehold.jp/24/424242/ffffff/56x56.png?text=TV"
                        }
                        alt={`${item.name}_logo`}
                      />
                    </IonThumbnail>
                    <IonLabel>{item.name}</IonLabel>
                    <ConnectStatus url={item.url} />
                  </IonItem>
                ))}
              </IonList>
              <IonInfiniteScroll
                onIonInfinite={loadData}
                disabled={isInfiniteDisabled}
              >
                <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PlayList;
