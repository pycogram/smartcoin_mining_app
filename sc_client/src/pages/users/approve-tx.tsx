import "../../css/page_css/user_css/confirm-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import confirm_pic from "../../images/pics/verify-illustraction.png";
import sc_logo from "../../images/logos/sc_logo.png";

const ApproveTx = () => {
    return ( 
        <div className="container">
            <div className="confirm-page approve-page">
                <form>
                    <span className="ref-span-go-back">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                    <span className="approve-h1-img">
                        <h1>50</h1>
                        <img src={sc_logo} alt="sc logo" />
                    </span>
                    <header>Enter code:</header>
                    <div className="input-box approve-ibox">
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
                    <p className="confirm-info approve-info">
                        Please enter pin and approve the transaction. 
                    </p>
                    <img src={confirm_pic} alt="confirm pic" />
                    <div className="for-secondary-btn">
                        <SecondaryBtn text_1={"go back"} text_2={"approve"} />
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default ApproveTx;