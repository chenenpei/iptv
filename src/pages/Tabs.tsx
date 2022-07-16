import { Redirect, Route } from "react-router-dom";
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { listSharp, listOutline, folderSharp, folderOutline } from "ionicons/icons";
import PlayList from "./PlayList";
import Player from "./Player";
import Search from "./Search";

const Tabs: React.FC = () => (
  <IonContent>
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/page" to="/page/list" />
        <Route path="/page/list/player/:name" exact={true}>
          <Player />
        </Route>
        <Route path="/page/list/search" exact={true}>
          <Search />
        </Route>
        <Route exact path="/page/list">
          <PlayList />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/page/list">
          <IonIcon md={listSharp} ios={listOutline} />
          <IonLabel>Play List</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/page/source">
          <IonIcon md={folderSharp} ios={folderOutline} />
          <IonLabel>Source</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonContent>
);

export default Tabs;
