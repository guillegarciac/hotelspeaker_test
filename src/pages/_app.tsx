import "../styles/globals.css"; // Update the path as per your project structure
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}