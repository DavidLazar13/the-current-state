# The Status Of Now (Installation)
David Lazar
## Application Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). This application is designed to run locally for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- npm (comes with Node.js)

## Getting Started

### Environment Setup

Create a `.env.local` file in the root of your project. Follow the `.env.example` file as a template to add the necessary environment variables:

```
AI_LICENSE_KEY=YOUR_MORPHCAST_SDK_LICENSE_KEY
GUARDIAN_API_KEY=YOUR_GUARDIAN_API_KEY
OPEN_API_KEY=YOUR_OPEN_API
```

### Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### Running the Development Server

Start the development server by running:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Application Structure

- **Multi-Screen Setup:** The application is intended to be displayed across three different screens in portrait mode:
    - **First Screen:** Serves as the main menu with buttons linking to each page.
    - **Observer Page:** Features installation sounds with a visible play button in the bottom right corner.

## Current Limitations

- The application currently runs only locally due to the size of the OpenAI requests, which can take up to 90 seconds to receive a response. A future update will address this performance issue.
- The application is accessible online (without OpenAI functionality) at [https://the-current-state.vercel.app/](https://the-current-state.vercel.app/).

## Libraries Used

- `react`: A JavaScript library for building user interfaces.
- `next`: The React framework for production.
- `styled-components`: Utilized for styling React components.
- `morphcast-sdk`: SDK for advanced media analysis.
- `openai sdk`: Tools for integrating OpenAI functionalities.
- `the guardian sdk`: API access to news and articles from The Guardian.
- `react-fast-marquee`: A React component for creating a marquee effect.
- `react-simple-typewriter`: A React hook for creating a typewriter effect.


