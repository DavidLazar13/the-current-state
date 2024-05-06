import { useEffect, useRef } from "react";
import { useExternalScript } from "../helpers/externalScriptsLoader";
import { getAiSdkControls } from "../helpers/loader";

import DominantEmotionComponent from "@/components/DominantEmotionComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";

export default function TheObserver() {
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
    <div>
      <FullscreenOnFKeyPress/>
      <div style={{width:"600px", height: "400px", position:"relative", display:"none"}}>
        <video id="videoEl"></video>
      </div>
      <DominantEmotionComponent></DominantEmotionComponent>
    </div>
  );
}
