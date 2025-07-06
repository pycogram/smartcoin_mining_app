import "../../css/page_css/user_css/dashboard.css";
import smartcoin_logo from "../../images/logos/sc_logo.png";
import mine from "../../images/pics/mine.png";
import boast from "../../images/pics/Boost.png";
import gift from "../../images/pics/gift.png";
import { Link} from "react-router-dom";
import pdp from "../../images/pics/pdp.png";
import Piechart from "../../components/chart/piechart";
import { useEffect, useState } from "react";
import Success from "../../components/alert/success";


const Dashboard = () => {
    const message_user = localStorage.getItem("message_user") ?? "";

    const [perfect, setPerfect] = useState<string>(message_user);

    useEffect(()=> {
        setTimeout(()=> {
            setPerfect("");
            localStorage.removeItem("message_user");
        }, 5 * 1000);
    }, []);

    return ( 
        <div className="dashboard">
            <nav className="db-navbar">
                <div className="menu-notify">
                    <Link to={""}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </Link>
                    <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="nav-option">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    </div>
                </div>
                <Link to={""}>
                    <div className="img-pdp">
                        <span className="">
                            <img src={pdp} alt="profile pic" />
                        </span>
                        <p className="">Ifesinachi .D</p>
                    </div>
                </Link>
            </nav>
            <div className="logo-amt-eye">
                {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}
                <img src={smartcoin_logo} alt="smartlogo" />
                <span className="mined-amt">
                    <h2>10,000</h2>
                    <h3>SC</h3>
                </span>
                <span className="iconx">
                    <i className="fa-solid fa-eye"></i>
                </span>

                    {/* <i className="fa-solid fa-eye icon"></i> */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="iconx">
                        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                    </svg> */}
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="iconx">
                        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                    </svg> */}


                {/* <i class="fa-solid fa-eye-slash"></i> */}
            </div>
            <div className="lock-coin">
                <p>Locked: $SC 6,000</p>
            </div>
            <div className="db-button">
                <span>
                    <i className="fa-solid fa-paper-plane"></i>
                    <p>Send</p>
                </span>
                <span>
                    <i className="fa-solid fa-repeat"></i>
                    <p>Receive</p>
                </span>
                <span>
                    <i className="fa-solid fa-share-nodes"></i>
                    <p>Referral</p>
                </span>
            </div>
            <div className="pie-sidebutton">
                <div className="piechart-sec">
                    <span className="piechart_css">
                        {/* <img src={piechart} alt="piechart analysis" /> */}
                        <Piechart basedmine={8_000} gifted={2_000} boast={1_000} />
                    </span>
                    
                    <ul>
                        <li>
                            Based mine: 8,000
                        </li>
                        <li>
                            Gifted: 2,000
                        </li>
                        <li>
                            Boast: 1,000
                        </li>                        
                    </ul>
                </div>
                <div className="db-sidebutton">
                    <span>
                        <img src={mine} alt="mining logo" />
                    </span>
                    <span>
                        <img src={boast} alt="boast logo" />
                    </span>
                    <span>
                        <img src={gift} alt="gift logo" />
                    </span>
                </div>
            </div>
        </div>
    );
}
 
export default Dashboard;