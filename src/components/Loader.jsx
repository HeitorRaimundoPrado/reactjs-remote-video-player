import { Oval } from 'react-loader-spinner'
import '../style/Loader.scss'

export default function Loader() {
    return (
        <div className="loader_container">
            <Oval
                height={80}
                width={80}
                color="#3777FF"
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#3777FF"
                strokeWidth={3}
                strokeWidthSecondary={3}
            />
        </div>
    )
}