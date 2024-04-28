import { useState, useEffect } from "react";
import Image from "next/image";

const GenderComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");

  const emotionImages = {
    angry: "/emotions/ANGRY/ANGRY_01.JPG",
    disgust: "/emotions/DISGUST/DISGUST_01.JPG",
    fear: "/emotions/FEAR/FEAR_01.JPG",
    happy: "/emotions/HAPPY/HAPPY_02.JPG",
    neutral: "/emotions/NEUTRAL/NEUTRAL_01.JPG",
    sad: "/emotions/SAD/SAD_02.JPG",
    surprise: "/emotions/SURPRISE/SURPRISE_01.JPG",
  };

  useEffect(() => {
    function handleEmotionEvent(evt) {
      const emotion = evt.detail.output.dominantEmotion || "neutral";
      setDominantEmotion(emotion.toLowerCase());
    }

    window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);

    return () => {
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, []);

  return (
    <div>
      {/*<p style={{fontSize: "20px"}}>Dominant Emotion Component:</p>*/}
      {/*<p>{dominantEmotion}</p>*/}
      {dominantEmotion && (
        <Image
          src={emotionImages[dominantEmotion]}
          alt={dominantEmotion}
          width={500}
          height={500}
        />
      )}
      {/* Preload Images */}
      <div style={{ display: "none" }}>
        {Object.values(emotionImages).map((src, index) => (
          <Image key={index} src={src} alt={`preload-${index}`} priority width={500} height={500} />
        ))}
      </div>
    </div>
  );
};

export default GenderComponent;
