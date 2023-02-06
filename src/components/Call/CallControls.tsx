import React, { FC } from "react";
import { HiMicrophone } from "react-icons/hi";
import { MdOutlineCallEnd } from "react-icons/md";
import { CallControlsProps } from "../../libs/interface";
//import { useCallControlsStyles } from "../../styles/callStyles";
import {
  BsFillMicMuteFill,
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill
} from "react-icons/bs";

const CallControls: FC<CallControlsProps> = (props) => {
  //const classes = useCallControlsStyles();
  const {
    tracks,
    trackState,
    endCommunication,
    activateVideoTrack,
    callType,
    mode,
    mute
  } = props;

  return (
    <div /* className={classes.root} */>
      {/*  ======= MUTE AND UNMUTE AUDIO ========= */}
      <p
        /* className={trackState.audio ? classes.icon : classes.icon} */
        onClick={() => mute("audio")}
      >
        {trackState.audio ? (
          <BsFillMicMuteFill size={25} color="#8A8A8A" />
        ) : (
          <HiMicrophone size={25} color="#8A8A8A" />
        )}
      </p>

      {/* ======= END CALL ======= */}
      {
        <p /* className={classes.endBtn} */ onClick={() => endCommunication()}>
          <MdOutlineCallEnd size={35} color="#fff" />
        </p>
      }

      {/* ======= MUTE AND UNMUTE VIDEO ======= */}
      <p
        /* className={trackState.video ? classes.icon : classes.icon} */
        onClick={() => {
          if (tracks[1] && callType === "video") {
            mute("video");
          } else {
            activateVideoTrack();
          }
        }}
      >
        {trackState.video || mode === "audio" ? (
          <BsFillCameraVideoOffFill size={25} color="#8A8A8A" />
        ) : (
          <BsFillCameraVideoFill size={25} color="#8A8A8A" />
        )}
      </p>
    </div>
  );
};

export default CallControls;
