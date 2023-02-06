import { AgoraUser } from "../libs/types";
import {
  IAgoraRTCRemoteUser,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";

export const createAgoraUser = (user: IAgoraRTCRemoteUser) => {
  const _user = {
    uid: user.uid,
    audio: user.hasAudio
      ? {
          track: user.audioTrack,
          muted: false,
        }
      : undefined,
    video: user.hasVideo
      ? {
          track: user.videoTrack,
          muted: false,
        }
      : undefined,
  };

  return _user;
};

export const createCustomRemoteTracks = (
  remoteVideoAudioTrack: [IRemoteAudioTrack, IRemoteVideoTrack]
) => {
  const customRemoteVideoTrack = {
    name: "remoteTracks",
    audioTrack: remoteVideoAudioTrack[0],
    videoTrack: remoteVideoAudioTrack[1],
  };
  return customRemoteVideoTrack;
};

export const createCustomLocalTracks = (
  remoteVideoAudioTrack: [IRemoteAudioTrack, IRemoteVideoTrack]
) => {
  const customRemoteVideoTrack = {
    name: "localTracks",
    audioTrack: remoteVideoAudioTrack[0],
    videoTrack: remoteVideoAudioTrack[1],
  };
  return customRemoteVideoTrack;
};

export const getInitials = (name: string) => {
  try {
    const splitedNamesArr = name.split(" ");

    const initailsArr = splitedNamesArr.map((name) => {
      const splitedNameArr = name.split("");
      return splitedNameArr[0];
    });

    return initailsArr.join("");
  } catch (error) {
    console.error("error from getInitials func.", error);
    return "";
  }
};
