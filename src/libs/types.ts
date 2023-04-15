import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";
export interface AgoraUser {
  uid: UID;
  audio?: {
    muted?: boolean;
    track?: IMicrophoneAudioTrack | IRemoteAudioTrack | ILocalAudioTrack;
  };
  video?: {
    muted?: boolean;
    track?: ICameraVideoTrack | IRemoteVideoTrack | ILocalVideoTrack;
  };
}
