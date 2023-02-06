import { status } from "../libs/mock";

import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";

/* export enum StatusType {
  pending = "pending",
  timeout = "timeout",
  ongoing = "ongoing",
  completed = "completed",
  cancelled = "cancelled",
  accepted = "accepted",
}; */
export type StatusType = keyof typeof status;

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
