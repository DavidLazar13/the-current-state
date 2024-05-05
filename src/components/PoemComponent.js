import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Typewriter } from 'react-simple-typewriter';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
`;

const TextFormated = styled.p`
    font-size: 32px;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
`

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

const HiddenMeasure = styled.div`
    visibility: hidden;
    position: absolute;
    white-space: pre;
    font-size: 28px;
    font-family: 'VT323', sans-serif;
`;

function PoemComponent({ generatedPoem, loading, error }) {
  const [plainTextPoem, setPlainTextPoem] = useState('');
  const [parsedHTML, setParsedHTML] = useState('');
  const [poemWidth, setPoemWidth] = useState('800px'); // Default width
  const [poemHeight, setPoemHeight] = useState('auto'); // Default height
  const [isContentVisible, setIsContentVisible] = useState(false); // Visibility control

  const measureRef = useRef(null);

  // Parse the poem text and update the hidden measurement div
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Parse HTML to extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatedPoem;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Hide content, then set the new poem content and make it visible after a delay
      setIsContentVisible(false);
      setPlainTextPoem('');
      setParsedHTML(tempDiv.innerHTML);

      setTimeout(() => {
        setPlainTextPoem(textContent);
        setIsContentVisible(true);
      }, 500); // Adjust this delay as needed
    }
  }, [generatedPoem]);

  // Measure both width and height using the hidden measurement div
  useEffect(() => {
    if (measureRef.current) {
      const { width, height } = measureRef.current.getBoundingClientRect();
      setPoemWidth(`${Math.ceil(width)}px`);
      setPoemHeight(`${Math.ceil(height)}px`);
    }
  }, [plainTextPoem]);

  if (error) return <Wrapper><TextFormated>Error: {error}</TextFormated> </Wrapper>;

  return (
    <Wrapper>
      <HiddenMeasure ref={measureRef}>{plainTextPoem}</HiddenMeasure>
      <Poem width={poemWidth} height={poemHeight}>
        {isContentVisible ? (
          <div>
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

