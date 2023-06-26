import { Oval } from 'react-loader-spinner'
import '../style/Loader.scss'

export default function Loader() {
    return (
        <div className="loader_container">
            <Oval
                height={50}
                width={50}
                color="#3777FF"
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#3777FF"
                strokeWidth={5}
                strokeWidthSecondary={5}
            />
        </div>
    )
}