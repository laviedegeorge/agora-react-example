import React, { FC, useEffect, useState } from "react";
import { debounce } from "lodash";
import "../../styles/callStyles.css";
import CallControls from "./CallControls";
import useAgora from "../../hooks/useAgora";
import useEvent from "react-use-event-hook";
import { useNavigate } from "react-router-dom";
import { CallProps } from "../../libs/interface";
import MediaPlayer from "../MediaPlayers/MediaPlayer";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const Call: FC<CallProps> = (props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"video" | "audio" | null>(null);
  const { channelName, appId, token, uid, callType } = props;
  const {
    join,
    leave,
    joinState,
    remoteUsers,
    activateVideo,
    localAudioTrack,
    localVideoTrack,
  } = useAgora(client);

  const localAudioAndVideo: [
    ILocalAudioTrack | undefined,
    ILocalVideoTrack | undefined
  ] = [localAudioTrack, localVideoTrack];

  const remoteAgoraUser = remoteUsers.length > 0 ? remoteUsers[0] : null;

  const discontinueCommunication = async () => {
    try {
      leave()
        .then(() => {
          navigate(`/rate-call`); // Or do whatever you like...
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.error("Failed to end communication", error);
      return error;
    }
  };

  const autoJoin = useEvent(
    debounce(() => {
      join(appId, channelName, token, uid, callType);
    }, 1000)
  );

  const [trackState, setTrackState] = useState({ video: false, audio: false });

  const mute = async (type: "audio" | "video") => {
    const [audio, video] = [localAudioTrack, localVideoTrack];

    try {
      if (type === "audio" && audio) {
        await audio.setMuted(!trackState.audio);
        setTrackState((ps) => {
          return { ...ps, audio: !ps.audio };
        });
      } else if (type === "video" && video) {
        await video.setMuted(!trackState.video);
        console.log("is video muted:", video.muted);

        setTrackState((ps) => {
          return { ...ps, video: !ps.video };
        });
      }
    } catch (error) {
      console.error("Error from mute function", error);
    }
  };

  useEffect(() => {
    !localVideoTrack
      ? setTrackState((prevState) => {
          return { ...prevState, video: true };
        })
      : setTrackState((prevState) => {
          return { ...prevState, video: false };
        });
  }, [localVideoTrack]);

  useEffect(() => {
    if (!joinState) {
      autoJoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMode(callType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${mode ? "block" : "hidden"} w-full`}>
      {/* ========================= VIDEO MODE ======================== */}
      <div
        className={`${
          mode === "audio" ? "hidden" : "block md:flex"
        } w-full h-full bg-[#313131] flex-col justify-end relative`}
      >
        {/* ========== VIDEOS ========== */}
        <div
          id="videos"
          className=" block lg:grid grid-cols-2 justify-center items-center flex-1 gap-5 lg:p-5 relative"
        >
          {/* ========= LOCAL VIDEO ========== */}
          {localVideoTrack && (
            <div className=" h-[200px] w-[150px] md:w-[200px] md:h-[250px] absolute right-2 top-10 z-30 md:top-2 lg:static lg:w-full lg:h-full">
              <MediaPlayer
                name="localTracks"
                videoTrack={localVideoTrack}
                audioTrack={undefined}
                userInfo={{ firstName: "Local", lastName: "User" }}
                hasAudio={localAudioTrack?.muted || false}
                hasVideo={!localVideoTrack?.muted}
              />
            </div>
          )}

          {/* =========== REMOTE VIDEO ============ */}
          {remoteAgoraUser && (
            <div className=" w-full h-screen lg:w-full lg:h-full">
              <div className=" h-full">
                <MediaPlayer
                  name="remoteTracks"
                  videoTrack={remoteAgoraUser?.videoTrack}
                  audioTrack={undefined}
                  userInfo={{ firstName: "Remote", lastName: "user" }}
                  hasAudio={remoteAgoraUser.hasAudio || false}
                  hasVideo={remoteAgoraUser.hasVideo}
                />
              </div>
            </div>
          )}
        </div>
        {/* ====== VIDEO CONTROLS ========= */}
        <div className="absolute right-0 left-0 bottom-0 z-50 lg:static mb-2">
          <CallControls
            activateVideoTrack={async () => {
              try {
                if (callType === "video") {
                  return;
                }
                if (mode === "audio") {
                  !localAudioAndVideo[1] && (await activateVideo());
                  setMode("video");
                } else {
                  localVideoTrack && (await localVideoTrack.setMuted(true));
                  setMode("audio");
                }
              } catch (error) {
                console.error("error from switching to video mode", error);
              }
            }}
            tracks={localAudioAndVideo}
            endCommunication={() => discontinueCommunication()}
            callType={callType}
            mode={mode}
            trackState={trackState}
            mute={(type) => mute(type)}
          />
        </div>
      </div>
      {/* ======================== AUDIO MODE ========================= */}
      <div
        className={`${
          mode === "video" ? "hidden" : "flex"
        } h-screen items-end bg-[#313131]`}
      >
        <div
          className={`w-full h-full flex flex-col justify-between items-stretch pt-5`}
        >
          {/* ============= REMOTE INFORMATION =============== */}
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <div className="relative rounded-full">
              {remoteUsers && remoteUsers.length >= 1 && (
                <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] scale-up-center bg-slate-700 rounded-full absolute z-0"></div>
              )}
              <img
                src={`www.pic.c`}
                alt={`Remote user`}
                className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] bg-white flex justify-center items-center rounded-full relative z-10"
              />
            </div>
            <p className="text-white font-semibold text-xl lg:text-3xl leading-[38.04px]">
              Remote user
            </p>
          </div>
          {/* ====== AUDIO CONTROLS ========= */}
          <div className=" space-y-4">
            <CallControls
              activateVideoTrack={async () => {
                try {
                  if (mode === "audio") {
                    !localAudioAndVideo[1]
                      ? await activateVideo()
                      : await localVideoTrack?.setMuted(false);
                    setMode("video");
                  } else {
                    setMode("audio");
                  }
                } catch (error) {
                  console.error("error from switching to video mode", error);
                }
              }}
              tracks={localAudioAndVideo}
              endCommunication={() => discontinueCommunication()}
              callType={callType}
              mode={mode}
              trackState={trackState}
              mute={(type) => mute(type)}
            />
            <div className="flex justify-center items-center mb-4">
              <p className="text-white text-sm leading-8 font-light tracking-[0.25%]">
                Powered by Agora
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Call;
