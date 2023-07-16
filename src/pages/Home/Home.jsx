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
                        This application works both as a YouTube client ( go to page on the right ) and as a music player ( page on the left )
                    </p>
                    <p>
                        Any usage of this application to violate copyright laws are not of responsibility of the creators, and any public file that violates them will be removed by the moderators
                    </p>
                    <a href="https://github.com/HeitorRaimundoPrado/reactjs-remote-video-player" target='_blank' rel='noreferrer'><img src='github.svg' height='20px' width='20x'/>GitHub</a>
                </header>
                <AuthLinks removeToken={useToken.removeToken}/>
            </main>
        </>
    )
}
