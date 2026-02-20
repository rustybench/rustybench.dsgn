import '../styles/globals.css';
import CursorTrail from '../components/CursorTrail';

export default function App({ Component, pageProps }) {
  return (
    <>
      <CursorTrail />
      <Component {...pageProps} />
    </>
  );
}
