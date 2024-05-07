import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Typewriter } from 'react-simple-typewriter';

// Styled component for the main content wrapper
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
`;

// Styled component for displaying error messages
const TextFormatted = styled.p`
    font-size: 32px;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
`;

// Styled component for the poem container
const Poem = styled.div`
    font-size: 28px;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
    white-space: pre-wrap;
    text-align: left;
    width: ${props => props.width || '800px'};
    height: ${props => props.height || 'auto'};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid transparent;
`;

// Styled component for measuring the size of the poem
const HiddenMeasure = styled.div`
    visibility: hidden;
    position: absolute;
    white-space: pre;
    font-size: 28px;
    font-family: 'VT323', sans-serif;
`;

// Component for displaying poems with a typewriter effect
function PoemComponent({ generatedPoem, error }) {
  const [plainTextPoem, setPlainTextPoem] = useState('');
  const [poemWidth, setPoemWidth] = useState('800px');
  const [poemHeight, setPoemHeight] = useState('auto');
  const [isContentVisible, setIsContentVisible] = useState(false);
  const measureRef = useRef(null);

  // Extract plain text from HTML and measure the content size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatedPoem;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      setIsContentVisible(false);

      setTimeout(() => {
        setPlainTextPoem(textContent);
        setIsContentVisible(true);
      }, 500); // Delay to simulate loading or processing time
    }
  }, [generatedPoem]);

  // Calculate and update the size of the poem based on the measured content
  useEffect(() => {
    if (measureRef.current) {
      const { width, height } = measureRef.current.getBoundingClientRect();
      setPoemWidth(`${Math.ceil(width)}px`);
      setPoemHeight(`${Math.ceil(height)}px`);
    }
  }, [plainTextPoem]);

  // Render error message if an error is present
  if (error) return <Wrapper><TextFormatted>Error: {error}</TextFormatted></Wrapper>;

  return (
    <Wrapper>
      <HiddenMeasure ref={measureRef}>{plainTextPoem}</HiddenMeasure>
      <Poem width={poemWidth} height={poemHeight}>
        {isContentVisible ? (
          <div> {/* This div wraps the Typewriter component */}
            <Typewriter
              words={[plainTextPoem]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={150}
              delaySpeed={1000}
              deleteSpeed={0}
            />
          </div>
        ) : null}
      </Poem>
    </Wrapper>
  );
}

export default PoemComponent;
