/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
  ILocalAudioTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ConnectionState,
} from "agora-rtc-sdk-ng";
import useEvent from "react-use-event-hook";

const localTracks: {
  videoTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
} = { videoTrack: undefined, audioTrack: undefined };

export default function useAgora(client: IAgoraRTCClient | undefined): {
  localAudioTrack: ILocalAudioTrack | undefined;
  localVideoTrack: ILocalVideoTrack | undefined;
  joinState: boolean;
  muteAudio: () => void;
  muteVideo: () => void;
  leave: () => Promise<void>;
  join: (
    appid: string,
    channel: string,
    token: string,
    uid: string | number | null,
    type: "audio" | "video"
  ) => void;
  remoteUsers: IAgoraRTCRemoteUser[];
  activateVideo: () => Promise<void>;
} {
  const [joinState, setJoinState] = useState(false);
  const [status, setStatus] = useState<ConnectionState>("DISCONNECTED");
  const options: { uid: number | string | null } & Record<string, any> = {
    appid: null,
    channel: null,
    uid: null,
    token: null,
  };
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [localVideoTrack, setLocalVideoTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<
    ILocalAudioTrack | undefined
  >(undefined);

  async function join(
    appid: string,
    channel: string,
    token: string,
    uid: string | number | null,
    type: "audio" | "video" = "video"
  ) {
    //console.log("call type >>>", type);
    if (!client) return;

    if (type === "video") {
      // create audio and video tracks and store
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);

      localTracks.audioTrack = audioTrack;
      localTracks.videoTrack = videoTrack;
      setLocalAudioTrack(localTracks.audioTrack);
      setLocalVideoTrack(localTracks.videoTrack);
    }

    if (type === "audio") {
      // create only audio track and store
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      localTracks.audioTrack = audioTrack;
      setLocalAudioTrack(localTracks.audioTrack);
    }

    // then join Agora channel
    if (status === "DISCONNECTED" || status === "DISCONNECTING") {
      const uuid = await client.join(appid, channel, token || null, uid);
      options.uid = uuid;
    }

    // console.log("local tracks >>>", { localTracks });

    // then publish
    if (type === "video") {
      await client.publish(Object.values(localTracks));
    }

    if (type === "audio" && localTracks["audioTrack"]) {
      await client.publish([localTracks["audioTrack"]]);
    }

    (window as any).client = client;
    if (localTracks.videoTrack) {
      (window as any).videoTrack = localTracks.videoTrack;
    }

    setJoinState(true);
  }

  const activateVideo = async () => {
    if (!client) return;
    const videoTrack = await AgoraRTC.createCameraVideoTrack();

    localTracks.videoTrack = videoTrack;
    setLocalVideoTrack(localTracks.videoTrack);

    await client.publish([localTracks["videoTrack"]]);

    (window as any).videoTrack = localTracks.videoTrack;
  };

  async function leave() {
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }

      await client?.leave();
      setRemoteUsers([]);
      setJoinState(false);
    } catch (error) {
      console.error("Something went wrong while leaving the channel", error);
    }
  }

  async function muteAudio() {
    if (localAudioTrack) {
      await localAudioTrack.setMuted(true);
    }
  }

  async function muteVideo() {
    if (localVideoTrack) {
      await localVideoTrack.setMuted(true);
    }
  }

  const handleUserPublished = useEvent(
    async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      if (!client) return;
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(() => Array.from(client.remoteUsers));
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    }
  );

  const handleUserUnpublished = useEvent(
    async (user: IAgoraRTCRemoteUser, mediaType) => {
      if (!client) return;
      await client.unsubscribe(user, mediaType); // new

      setRemoteUsers(() => {
        // console.log(">>> remote users", client.remoteUsers);
        return Array.from(client.remoteUsers);
      });
      if (mediaType === "audio") {
        user.audioTrack?.stop();
      }
    }
  );

  const handleUserJoined = useEvent((/* user: IAgoraRTCRemoteUser */) => {
    if (!client) return;
    setRemoteUsers(() => Array.from(client.remoteUsers));
  });

  const handleUserLeft = useEvent((/* user: IAgoraRTCRemoteUser */) => {
    if (!client) return;
    setRemoteUsers(() => Array.from(client.remoteUsers));
  });

  const onConnectionStateChange = useEvent(
    (state: ConnectionState /* prevState, reason */) => {
      // console.log("connection-state-change", `${prevState} -> ${state}`, reason);
      setStatus(state);
    }
  );

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client.on("connection-state-change", onConnectionStateChange);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.off("connection-state-change", onConnectionStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    muteAudio,
    muteVideo,
    leave,
    join,
    remoteUsers,
    activateVideo,
  };
}
