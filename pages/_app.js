import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { TransactionsProvider } from "../context/TransactionContext";
import Welcome from "../components/Welcome";

function MyApp({ Component, pageProps }) {
  return (
    <TransactionsProvider>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </TransactionsProvider>
  );
}

export default MyApp;
