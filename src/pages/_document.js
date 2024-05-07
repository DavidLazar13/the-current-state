// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * Custom Document to augment the application's HTML and server-side rendering.
 * This implementation integrates styled-components for SSR (Server-Side Rendering)
 * to handle CSS in JS styles properly during server rendering.
 */
class MyDocument extends Document {
  /**
   * getInitialProps belongs to `_document` (instead of `_app`), it's compatible with static-site generation (SSG).
   * This custom method retrieves initial properties and styles for the document.
   * @param {Object} ctx - Context object containing various rendering information.
   */
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet(); // Create an instance of ServerStyleSheet
    const originalRenderPage = ctx.renderPage;

    try {
      // Enhance the app component to wrap it with the style sheet collector
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        });

      // Run the parent getInitialProps with the enhanced render page
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles} {/* Existing styles from Document */}
            {sheet.getStyleElement()} {/* Style element from styled-components */}
          </>
        ),
      };
    } finally {
      sheet.seal(); // Seal the style sheet to prevent further changes
    }
  }

  /**
   * Render method to define the structure of the document HTML.
   * This includes the Head, Main, and NextScript components from Next.js
   */
  render() {
    return (
      <Html lang="en"> {/* Set the language attribute for accessibility */}
        <Head>
          {/* Link to external Google Fonts */}
          <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        </Head>
        <body>
        <Main /> {/* Main rendering area for the app content */}
        <NextScript /> {/* Scripts to be loaded after the app content */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
