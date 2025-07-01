import "../../css/page_css/user_css/confirm-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import confirm_pic from "../../images/pics/verify-illustraction.png";
import { useLocation } from "react-router-dom";

const ConfirmPage = () => {
    // get items stored in state passed from verify page
    const location = useLocation();
    const userInfo =  location?.state ?? "";

    //input state
    const message = userInfo?.message;

    return ( 
        <div className="container">
            <div className="confirm-page">
                <form>
                    <header>Enter code:</header>
                    <div className="input-box">
                        <input type="text" maxLength={1} />
                        <input type="text" maxLength={1} />
                        <input type="text" maxLength={1} />
                        <input type="text" maxLength={1} />
                        <input type="text" maxLength={1} />
                        <input type="text" maxLength={1} />
                    </div>
                    <div className="input-btn">
                        <i className="fa-solid fa-eraser icon-btn"></i>
                        <i className="fa-regular fa-paste icon-btn"></i>
                    </div>
                    { message && 
                        <p className="confirm-info">
                            {message}
                        </p>
                    }
                    <img src={confirm_pic} alt="confirm pic" />
                    <div className="for-secondary-btn">
                        <SecondaryBtn text_1={"Go back"} text_2={"Confirm"} />
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default ConfirmPage;