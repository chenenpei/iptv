import { IonBadge } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { fetchWithTimeout } from "../utils";

enum Status {
  PING = "PING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
const ConnectStatus: React.FC<{ url?: string }> = (props) => {
  const { url } = props;
  const [time, setTime] = useState("");
  const [status, setStatus] = useState(Status.PING);

  const color = useMemo(() => {
    switch (status) {
      case Status.PING:
        return "primary";
      case Status.FAILED:
        return "danger";
      case Status.SUCCESS:
        return "success";
      default:
        return "primary";
    }
  }, [status]);

  useEffect(() => {
    const startTime = new Date().getTime();

    if (!url) {
      setStatus(Status.FAILED);
      return;
    }

    const getStatus = async () => {
      try {
        await fetchWithTimeout(url, { timeout: 5000 });
        setTime((new Date().getTime() - startTime).toString());
        setStatus(Status.SUCCESS);
      } catch (error) {
        setStatus(Status.FAILED);
      }
    };

    getStatus();
  }, [url]);

  if (status === Status.PING) return null;

  return (
    <IonBadge class="status-badge" color={color}>
      {time ? time + "ms" : "NULL"}
    </IonBadge>
  );
};

export default ConnectStatus;
