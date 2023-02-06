import React from "react";
import { NameHolder } from "../NameHolder";
import AltMediaDisplay from "./AltMediaDisplay";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { MediaPlayerProps } from "../../libs/interface";

const MediaPlayer = (props: MediaPlayerProps) => {
  const { firstName, lastName } = props.userInfo;
  const altBgColor = props.name === "localTracks" ? "bg-blue-500" : "bg-white";
  const altTextColor =
    props.name === "localTracks" ? "text-white" : "text-blue-500";
  const name = props.name === "localTracks" ? `You` : `Dr. ${firstName}`;
  const altName = props.name === "localTracks" ? "Patient" : "Doctor";

  return (
    <div className="w-full h-full">
      <>
        <>
          {props.videoTrack && props.hasVideo && (
            <div className=" h-full relative">
              <AgoraVideoPlayer
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
                videoTrack={props.videoTrack}
              />
              <div
                className={`absolute bottom-4 left-4 ${
                  props.name === "localTracks" ? "" : "hidden lg:block"
                }`}
              >
                <NameHolder name={`${name || altName}`} />
              </div>
            </div>
          )}
        </>
        <>
          {!props.hasVideo && (
            <div className="w-full h-full bg-black rounded-xl">
              <AltMediaDisplay
                firstName={firstName || ""}
                lastName={lastName || ""}
                textColor={`${altTextColor}`}
                bgColor={`${altBgColor}`}
                variant={props.name === "localTracks" ? "small" : "normal"}
              />
            </div>
          )}
        </>
      </>
    </div>
  );
};

/* !props.videoTrack?.muted for local track */
/* transform: rotate(90deg); */

export default MediaPlayer;
