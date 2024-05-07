import React from "react";
import styled from "styled-components";
import Link from "next/link"; // Import the Link component from Next.js for client-side navigation

// Styled component for the main wrapper around the button links
const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; // Full viewport height
    font-family: 'VT323', sans-serif; // Monospace style font for retro computer aesthetic
`;

// Styled component for buttons with dynamic styling based on props
const Button = styled.button`
    color: #33ff18; // Neon green color
    padding: 15px;
    border-radius: 5px;
    font-size: 25px; // Larger font size for better readability
    border: 1px solid #33ff18; // Border styled to match the text color
    margin: 20px;
    cursor: pointer; // Cursor indicates the button is clickable
    opacity: ${({ hidden }) => (hidden ? 0 : 1)}; // Support for an optional 'hidden' prop to control visibility
    transition: visibility 0.2s, opacity 0.2s; // Smooth transition for opacity and visibility changes
`;

// Functional component for the Home page
export default function Home() {
  return (
    <Wrapper>
      {/* Each button is wrapped in a Link component to enable SPA-style navigation without page reloads */}
      <Link href="/the-creator" passHref>
        <Button>The Creator</Button>
      </Link>
      <Link href="/the-observer" passHref>
        <Button>The Observer</Button>
      </Link>
      <Link href="/the-witness" passHref>
        <Button>The Witness</Button>
      </Link>
    </Wrapper>
  );
}
