import Head from "next/head";
import Game from "../components/Game"

export default function Home() {

    

    return (
        <>
        <Head>
            <title>Create Next App</title>
          
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Game/>
        </>
    );
    }
