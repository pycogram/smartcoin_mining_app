import '../../css/component_css/button/primary-btn.css';

type PrimaryBtnProp = {
    btnText : string,
}

const PrimaryBtn = ({btnText} : PrimaryBtnProp) => {
    return ( 
        <button className="primary-btn">{btnText}</button>
    );
}
 
export default PrimaryBtn;