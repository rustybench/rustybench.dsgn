import '../styles/globals.css';
import CursorTrail from '../components/CursorTrail';
import ScrollProgress from '../components/ScrollProgress';

export default function App({ Component, pageProps }) {
  return (
    <>
      <CursorTrail />
      <ScrollProgress />
      <Component {...pageProps} />
    </>
  );
}
