import { Inter } from "next/font/google";
import { useEffect, useRef } from "react";
import { useExternalScript } from "../helpers/externalScriptsLoader";
import { getAiSdkControls } from "../helpers/loader";

import DominantEmotionComponent from "@/components/DominantEmotionComponent";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
  const videoEl = useRef(undefined)
  useEffect(() => {
    videoEl.current = document.getElementById("videoEl");
    async function getAiSdk (){
      if(aiSdkState === "ready" && mphToolsState === "ready"){
        const { source, start } = await getAiSdkControls();
        await source.useCamera({
          toVideoElement: document.getElementById("videoEl"),
        });
        await start();
      }
    }
    getAiSdk();
  }, [aiSdkState, mphToolsState]);


  return (
    <div className="App">
      <header className="App-header">
        <div style={{display:"flex", flexDirection: "column", alignItems:"center"}}>
          <div style={{width:"600px", height: "400px", position:"relative"}}>
            {/*<video id="videoEl"></video>*/}
            {/*<FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>*/}
          </div>
          {/*<MoodComponent></MoodComponent>*/}
          <DominantEmotionComponent></DominantEmotionComponent>
        </div>
      </header>
    </div>
  );
}
