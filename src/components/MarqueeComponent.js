import Marquee from "react-fast-marquee";
import styled from "styled-components";

// Styled component for the wrapper that contains the marquee

const Wrapper = styled.div`
    font-size: 54px; // Sets the font size for the text inside the marquee
`;

// Component to display scrolling text using the Marquee package
export default function MarqueeComponent({ text, speed, backgroundColor, textColor }) {
  return (
    <Wrapper>
      {/* Marquee component with configurable properties */}
      <Marquee
        gradient={false}  // Disables gradient on the sides
        speed={speed}     // Speed of the marquee scroll
        autoFill={true}   // Enables automatic filling of content to avoid blank spaces
        style={{
          backgroundColor, // Background color of the marquee
          color: textColor // Text color of the marquee
        }}
      >
        {text}
      </Marquee>
    </Wrapper>
  );
}
