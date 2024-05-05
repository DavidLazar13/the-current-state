import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Typewriter } from 'react-simple-typewriter';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%; // Full-width for consistent alignment
`;

const Poem = styled.div`
    font-size: 24px;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
    white-space: pre-wrap;
    text-align: left; /
    width: ${props => props.width || '800px'}; // Dynamic width
    height: ${props => props.height || 'auto'}; // Dynamic height
    margin: 0 auto; 
    display: flex;
    flex-direction: column; 
    justify-content: flex-start; 
    border: 1px solid transparent; 
`;

const HiddenMeasure = styled.div`
    visibility: hidden;
    position: absolute;
    white-space: pre; // Ensure text keeps its format
    font-size: 24px;
    font-family: 'VT323', sans-serif;
`;

function PoemComponent({ generatedPoem, loading, error }) {
  const [plainTextPoem, setPlainTextPoem] = useState('');
  const [parsedHTML, setParsedHTML] = useState('');
  const [poemWidth, setPoemWidth] = useState('800px'); // Default width
  const [poemHeight, setPoemHeight] = useState('auto'); // Default height

  const measureRef = useRef(null);

  // Parse the poem text and update the hidden measurement div
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Parse HTML to extract text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatedPoem;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      setPlainTextPoem(textContent);
      setParsedHTML(tempDiv.innerHTML); // Preserve original HTML
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

  if (loading) return <Wrapper><Poem>Loading...</Poem></Wrapper>;
  if (error) return <Wrapper><Poem>Error: {error}</Poem></Wrapper>;

  return (
    <Wrapper>
      <HiddenMeasure ref={measureRef}>{plainTextPoem}</HiddenMeasure>
      <Poem width={poemWidth} height={poemHeight}>
        {plainTextPoem ? (
          <div>
            <Typewriter
              words={[plainTextPoem]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={50}
              deleteSpeed={0}
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: parsedHTML }} />
        )}
      </Poem>
    </Wrapper>
  );
}

export default PoemComponent;
