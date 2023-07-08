import React from 'react'
import ReactDOM from 'react-dom'
import '../../style/Home.scss';
import '../../style/_global.scss';
import AuthLinks from '../../components/AuthLinks.jsx'

import useToken from "../../components/UseToken.jsx"

export default function Home() {
    return (
        <>
            <header>
                
            </header>
            <main>
                <header>
                    <h2>About</h2>
                    <p>
                        This is a cutting-edge web application that seamlessly integrates the power of the YouTube API for video playback while offering the convenience of uploading and reproducing your own audio content.
                    </p>
                </header>
                <AuthLinks removeToken={useToken.removeToken}/>
            </main>
        </>
    )
}
