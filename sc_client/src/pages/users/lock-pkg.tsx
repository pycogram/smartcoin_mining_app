import SecondaryBtn from "../../components/button/secondary-btn";
import "../../css/page_css/user_css/select-pkg.css";
import "../../css/page_css/user_css/send-sc.css";
import fireF from "../../images/pics/fire-frame.png";

const LockPkg = () => {
    return ( 
            <div className="send-sc lock-pkg-sc">
                <form action="">
                    <span className="ref-span-go-back">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                    <div className="select-lock-pkg lock-pkg">
                        <div className="each-pkg">
                            <span>
                                <h4>~ fire ~</h4>
                                <img src={fireF} alt="fire package" />
                            </span>
                            <span>
                                <h2>10 days</h2>
                                <h3>40% returns</h3>
                            </span>
                        </div>
                        <div className="w-addy">
                            <h3>amount</h3>
                            <span>
                                <input type="text" placeholder="500" />
                                <i>SC</i>
                            </span>
                            <div>
                                <p>max</p>
                                <p>avail: 200 SC</p>
                            </div>
                        </div>
                        <div className="w-info">
                            <span>
                                <p>6500 $SC will be returned after 10days.</p>
                            </span>
                        </div>
                        <div className="w-button">
                            <SecondaryBtn text_1="go back" text_2="lock" />
                        </div>
                    </div>
                </form>
            </div>
    );
}
 
export default LockPkg;