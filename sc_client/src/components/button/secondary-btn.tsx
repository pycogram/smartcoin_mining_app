import { JSX } from "react";
import "../../css/component_css/button/secondary-btn.css";

type SecondaryBtnProp = {
    text_1 : string,
    text_2 : string,
    icon_1 ?: JSX.Element,
    icon_2 ?: JSX.Element
}

const SecondaryBtn = ({text_1, text_2, icon_1, icon_2}: SecondaryBtnProp) => {
    return (
        <span className="secondary-btn">
            <button className="s-btn1">
                {icon_1 || <i className="fa-solid fa-arrow-left icon-btn"></i>}
                {text_1}
            </button>
            <button className="s-btn1 s-btn2">
                {text_2}
                {icon_2 || <i className="fa-solid fa-arrow-right icon-btn"></i>}
            </button>
        </span>
     );
}
 
export default SecondaryBtn;