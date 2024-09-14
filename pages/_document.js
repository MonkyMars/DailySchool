// pages/_document.js

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/Logo/SchoolTool-Logo.png" type="image/png" />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/Logo/SchoolTool-Logo.png"
        />

        {/* Other meta tags or external stylesheets */}
        <meta name="description" content="A tool for keeping track of notes, homework and much more." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}