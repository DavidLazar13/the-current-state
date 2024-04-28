import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';

// Styled Components
const MoodContainer = styled.div`
  position: relative;
  background-color: black;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
  pointer-events: none;
`;

const PinWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

const Pin = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa8a;
  opacity: 0;
  position: absolute;
  bottom: 48%;
  left: 48%;
`;

const MoodComponent = () => {
  const grid = useRef(undefined);
  const pin_wrap = useRef(undefined);
  const pin = useRef(undefined);
  const [gridN, setGridN] = useState(38);
  const crtDisableTimeout = useRef(undefined);

  useEffect(() => {
    grid.current = document.querySelector("#grid");
    pin_wrap.current = document.querySelector(".pin_wrap");
    pin.current = document.querySelector(".pin");
    if(grid.current && pin_wrap.current){
      bindEvent();
    }
    function resetTimeout() {
      let to = crtDisableTimeout.current;
      clearTimeout(to);
      to = setTimeout(() => {
        hidePin()
      }, 3000)

      crtDisableTimeout.current = to;
    }

    function bindEvent(){
      resetTimeout();
      window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", fn);
      window.addEventListener("resize", fn2);
    }

    function fn(evt) {
      showPin();
      setEmotion(evt.detail.output);
      resetTimeout();
    };

    function fn2() {
      setDim();
    };

    function setDim() {
      if (!grid.current || grid.current.clientWidth === 0) {
        setTimeout(() => {
          setDim();
        }, 10);
      } else {
        pin_wrap.current.style.width = `${grid.current.clientWidth}px`;
        pin_wrap.current.style.height = `${grid.current.clientHeight}px`;
      }
    }

    function setEmotion({ arousal = 0, valence = 0 }) {
      let { x, y } = calcCoordinate({ valence, arousal });
      x = Math.max(x, 5.15); // Check img ratio to avoid ellipse
      y = Math.max(y, 6);
      setPinPosition(x, y);
    }

    function calcCoordinate({ valence = 0, arousal = 0 }) {
      const img_outer_width = 800;
      const img_inner_width = 598;
      const img_x_offset = 101;
      const img_outer_height = 686;
      const img_inner_height = 598;
      const img_y_offset = 45;
      const normalized = (z) => (z + 1) / 2;
      return {
        x: (100 * (img_x_offset + img_inner_width * normalized(valence))) / img_outer_width,
        y: (100 * (img_y_offset + img_inner_height * normalized(arousal))) / img_outer_height,
      };
    }

    function setPinPosition(x, y) {
      pin.current.style.left = `${x - 5.15}%`;
      pin.current.style.bottom = `${y - 6}%`;
    }

    function showPin() {
      pin.current.style.opacity = 0.7;
    }

    function hidePin() {
      pin.current.style.opacity = 0;
    }

  }, [grid, pin, pin_wrap]);

  return (
    <MoodContainer>
      <p style={{fontSize: "20px"}}>Mood Component:</p>
      <Wrapper>
        <Grid id="grid">
          {gridN === 38 && <img alt="" src="/baseGraph.png" style={{width: "100%", height: "100%"}} />}
          {gridN === 98 && <img alt="" src="/advancedGraph.png" style={{width: "100%", height: "100%"}} />}
          <PinWrap className="pin_wrap">
            <Pin className="pin" />
          </PinWrap>
        </Grid>
      </Wrapper>
      <div>
        <button onClick={() => setGridN(38)} disabled={gridN === 38}>38 Affects</button>
        <button onClick={() => setGridN(98)} disabled={gridN === 98}>98 Affects</button>
      </div>
    </MoodContainer>
  );
};

export default MoodComponent;
