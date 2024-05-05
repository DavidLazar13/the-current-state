import Marquee from "react-fast-marquee";
import styled from "styled-components";

// Styled components
const Wrapper = styled.div`
  font-size: 54px;
`;

export default function MarqueeComponent({ text, speed, backgroundColor, textColor }) {
  return (
    <Wrapper>
      <Marquee gradient={false} speed={speed} autoFill={true} style={{ backgroundColor, color: textColor }}>
        {text}
      </Marquee>
    </Wrapper>
  );
}
