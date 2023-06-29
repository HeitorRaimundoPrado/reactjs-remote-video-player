import React, {useEffect} from 'react';
import {CapacitorVideoPlayer} from 'capacitor-video-player';

const VideoPlayer = (props) => {
    useEffect( () => {
        const playVideo = async () => {
            const url = props.url;
            console.log(`url: ${url}`);
            const init = await CapacitorVideoPlayer.initPlayer({
                mode: "embedded",
                url: url,
                playerId: "fullscreen",
                componentTag: "div"
            })
            console.log(`init ${JSON.stringify(init)}`)
        }
        playVideo(() => {
            console.log('in playing video')
        })
    });
    return (
        <div id="fullscreen" slot="fixed">
        </div>
    )
}
export default VideoPlayer
