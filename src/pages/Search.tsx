import {
  IonCard,
  IonCardContent,
  IonContent,
  IonPage,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  isPlatform,
} from "@ionic/react";
import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import ConnectStatus from "../components/ConnectStatus";
import { useSearchStore } from "../store";
import "./Search.css";

const Search: React.FC = () => {
  const history = useHistory();
  const searchList = useSearchStore((state) => state.list);
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    if (!keyword) return [];
    return searchList.filter((item) =>
      item.name.toLocaleLowerCase().includes(keyword.toLowerCase())
    );
  }, [searchList, keyword]);

  return (
    <IonPage className="page-serach">
      {!isPlatform("ios") ? (
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonToolbar>
              <IonSearchbar
                value={keyword}
                onIonChange={(e) => setKeyword(e.detail.value!)}
                onIonClear={() => setKeyword("")}
                showCancelButton="always"
                onIonCancel={() => {
                  history.goBack();
                }}
              />
            </IonToolbar>
          </IonToolbar>
        </IonHeader>
      ) : null}

      <IonContent fullscreen>
        {isPlatform("ios") ? (
          <div style={{ width: "100%", height: "44px" }}></div>
        ) : null}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonSearchbar
              value={keyword}
              onIonChange={(e) => setKeyword(e.detail.value!)}
              onIonClear={() => setKeyword("")}
              onIonCancel={() => {
                history.goBack();
              }}
              showCancelButton="always"
            />
          </IonToolbar>
        </IonHeader>
        {keyword ? (
          filtered.length ? (
            isPlatform("ios") ? (
              <div className="search-main-card">
                <IonList>
                  {filtered.map((item) => (
                    <IonItem
                      key={item.url}
                      routerLink={`/page/list/player/${encodeURIComponent(
                        item.name
                      )}?url=${btoa(item.url)}`}
                    >
                      <IonLabel>{item.name}</IonLabel>
                      <ConnectStatus url={item.url} />
                    </IonItem>
                  ))}
                </IonList>
              </div>
            ) : (
              <IonCard className="search-main-card">
                <IonCardContent>
                  <IonList>
                    {filtered.map((item) => (
                      <IonItem
                        key={item.url}
                        routerLink={`/page/list/player/${encodeURIComponent(
                          item.name
                        )}?url=${btoa(item.url)}`}
                      >
                        <IonLabel>{item.name}</IonLabel>
                        <ConnectStatus url={item.url} />
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            )
          ) : (
            <h5 style={{ textAlign: "center", color: "#424242" }}>No Result</h5>
          )
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Search;
