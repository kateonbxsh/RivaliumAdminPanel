import {AppProps} from "next/app";

export default function AdminPanel({Component, pageProps}: AppProps) {
    return <Component {...pageProps}/>;
}