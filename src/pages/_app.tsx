import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false; 

const MyApp: AppType = ({ Component, pageProps }) => {
  return <ClerkProvider {...pageProps}>
            <Head>
              <title>Chirp</title>
              <meta name="description" content="Generated by create-t3-app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster position="bottom-center"/>
            <Component {...pageProps} />
          </ClerkProvider>;
};

export default api.withTRPC(MyApp);
