import React from "react";
import styled from "styled-components";
import Link from "next/link";  // Import the Link component


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
    font-family: 'VT323', sans-serif;
`;


const Button = styled.button`
    color: #33ff18;
    padding: 15px;
    border-radius: 5px;
    font-size: 25px;
    border: 1px solid #33ff18;
    margin: 20px;
    cursor: pointer;
    opacity: ${({ hidden }) => (hidden ? 0 : 1)};
    transition: visibility 0.2s, opacity 0.2s;
`;

export default function Home() {


  return (
        <Wrapper>
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
