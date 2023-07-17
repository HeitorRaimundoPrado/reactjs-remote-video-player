import React from 'react'
import ReactDOM from 'react-dom'
import '../../style/Home.scss';
import '../../style/_global.scss';
import AuthLinks from '../../components/AuthLinks.jsx'

import UseToken from "../../components/UseToken.jsx"

export default function Home(props) {
    const { token, removeToken, setToken } = UseToken();
    return (
        <>
            <main>
                <header>
                    <h2> {props.t('home.header.title')} </h2>
                    <p> {props.t('home.header.firstParagraph')} </p>
                    <p> {props.t('home.header.secondParagraph')} </p>
                    <p> {props.t('home.header.thirdParagraph')}</p>
                    <a href="https://github.com/HeitorRaimundoPrado/reactjs-remote-video-player"><img src='github.svg' height='20px' width='20x'/>GitHub</a>
                </header>
                <AuthLinks removeToken={removeToken}/>
            </main>
        </>
    )
}
