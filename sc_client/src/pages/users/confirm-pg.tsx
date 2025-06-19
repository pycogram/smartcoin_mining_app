import "../../css/page_css/user_css/confirm-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import confirm_pic from "../../images/pics/verify-illustraction.png";

const ConfirmPage = () => {
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
                    <p className="confirm-info">
                        A verification code has been sent to your email address. Please check either your email inbox or spam-box.
                    </p>
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