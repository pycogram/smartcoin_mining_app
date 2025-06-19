import "../../css/page_css/user_css/verify-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import verify_pic from "../../images/pics/verify-illustraction.png";

const VerifyPage = () => {
    return ( 
        <div className="verify-page">
            <form> 
                <header className="header-text">Verify</header>
                <p className="verify-info">
                    Hi, Daniel. Your account has been registered succesfully. 
                    In order to make use of your account ( <b><i> daniel@gmail.com </i></b> ). 
                    Please hit the verify button to receive email verification code.
                </p>
                <img src={verify_pic} alt="" />
                <div className="for-secondary-btn">
                    <SecondaryBtn text_1={"Go back"} text_2={"Verify"} />
                </div>
            </form>
        </div>
    );
}

export default VerifyPage;