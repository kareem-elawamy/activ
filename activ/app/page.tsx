// pages/_app.jsx  ← Next.js Pages Router  (use THIS instead of layout.jsx if you're on Pages Router)
import "../lib/i18n"; // initialise i18n once
import { appWithTranslation } from "next-i18next"; // not needed — we use react-i18next directly
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const lang = i18n.language || "ar";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}

export default MyApp;
