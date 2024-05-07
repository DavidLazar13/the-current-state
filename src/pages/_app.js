// Import global styles that will apply to all pages in the application.
import "@/styles/globals.css";

/**
 * Custom App component for Next.js.
 * It renders the active page component with its associated props.
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
