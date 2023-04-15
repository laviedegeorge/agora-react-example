import React from "react";
import "./App.css";
import Call from "./components/Call/Call";

function App() {
  const appId = React.useRef(process.env.REACT_APP_AGORA_APP_ID || "").current;
  // you can use a function to generate this... or generate it and pass it as a props into the component or use Context API
  const channelId = "";
  const token = "";
  const uid = 6475;
  const contactMedium = "video";

  return (
    <div className="App">
      <div className=" w-full h-screen flex flex-col relative sm:bg-transparent lg:bg-[#313131]">
        <div className=" flex-1 flex">
          <Call
            appId={`${appId}`}
            channelName={`${channelId}`}
            token={token}
            uid={uid}
            callType={contactMedium} // can be video or audio
          />
        </div>
      </div>
    </div>
  );
}

export default App;
