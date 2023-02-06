import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";

export interface CallProps {
  channelName: string;
  appId: string;
  token: string;
  uid: number;
  callType: "video" | "audio";
}

export interface CallControlsProps {
  client?: IAgoraRTCClient;
  tracks: [
    ILocalAudioTrack | IMicrophoneAudioTrack | undefined,
    ILocalVideoTrack | ICameraVideoTrack | undefined
  ];
  setStart?: React.Dispatch<React.SetStateAction<boolean>>;
  setInCall?: React.Dispatch<React.SetStateAction<boolean>>;
  endCommunication: () => Promise<unknown>;
  activateVideoTrack: () => void;
  callType: "video" | "audio";
  mode: "video" | "audio" | null;
  trackState: { video: boolean; audio: boolean };
  mute: (type: "audio" | "video") => void;
}

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

export type AppRemoteTracks = {
  name: "remoteTracks";
  user: IAgoraRTCRemoteUser;
  hasVideo: boolean;
};

export interface AppLocalTrack {
  name: "localTracks";
  audioTrack: ILocalAudioTrack | undefined;
  videoTrack: ILocalVideoTrack | undefined;
  userInfo: { firstName: string; lastName: string };
}

//export type MediaPlayerProps = AppRemoteTracks | AppLocalTrack;

export interface MediaPlayerProps {
  name: "localTracks" | "remoteTracks";
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  hasVideo: boolean;
  hasAudio: boolean;
  userInfo: { firstName: string; lastName: string };
}
