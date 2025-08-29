"use client";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS is fine on the server
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import { store } from "../../store/store";


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <Provider store={store}>{children}</Provider>
        <Footer />
      </body>
    </html>
  );
}
