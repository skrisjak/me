import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link
                href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Nova+Mono&family=Outfit:wght@100..900&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
                rel="stylesheet"/>
            <Script src="https://kit.fontawesome.com/84d62f90ab.js" crossOrigin="anonymous" />
        </Head>
        <body className="antialiased">
        <Main/>
        <NextScript/>
        </body>
    </Html>
  );
}
