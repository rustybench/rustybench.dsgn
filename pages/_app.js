import '../styles/globals.css';
import CursorTrail from '../components/CursorTrail';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';

export default function App({ Component, pageProps }) {
  return (
    <>
      <CursorTrail />
      <ScrollProgress />
      <ScrollToTop />
      <Component {...pageProps} />
    </>
  );
}
