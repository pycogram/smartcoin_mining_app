import "../../css/page_css/user_css/dashboard.css";
import mine from "../../images/pics/mine.png";
import lock from "../../images/pics/Boost.png";
import update_prof from "../../images/pics/gift.png";
import { Link} from "react-router-dom";
import pdp from "../../images/pics/pdp.png";
import Piechart from "../../components/chart/piechart";
import { useContext, useEffect, useState } from "react";
import Success from "../../components/alert/success";
import { UserContext } from "../../contexts/user";
import { mineDetail, mineSc } from "../../controllers/dashboard";
import Fail from "../../components/alert/fail";

const Dashboard = () => {
    const message_user = localStorage.getItem("message_user") ?? "";

    const {user} = useContext(UserContext)!;

    const [perfect, setPerfect] = useState<string>(message_user);
    const [hideBal, setHideBal] = useState<boolean>(false);
    const [minedSc, setMinedSc] = useState<number>(0);
    const [lockedSc, setLockedSc] = useState<number>(0);
    const [minedScStatus, setMinedScStatus] = useState<boolean>(false);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [totalSc, setTotalSc] = useState<number>(0);
    const [isReady, setIsReady] = useState<boolean>(true);

    const mineRate = 30;
    const mineDuration = 2400;
    
    useEffect(() => {
        if(endTime === null) return ;
        const interval = setInterval(() => {
            const currentTime = Date.now(); 
            if (endTime && currentTime <= endTime) {
                setMinedSc((prev) => {
                    const next = prev + (mineRate / mineDuration);
                    if (next >= totalSc) {
                        setEndTime(null);
                        clearInterval(interval);
                        return totalSc;
                    } 
                    return next;
                });
            } else {
                setEndTime(null);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);


    useEffect(()=> {

        setTimeout(()=> {
            setPerfect("");
            localStorage.removeItem("message_user");
        }, 5 * 1000);

        setTimeout(async ()=> {
            try{
                const {data} = await mineDetail();

                const endTime = new Date(data.end_time).getTime();
                const total_mined = data.total_mined;
                const total_locked = data.total_locked;
                const nowTime = Date.now();
                const diffTime =  Math.floor((nowTime - endTime) / 1000);
                const scPerTime = Math.abs((mineRate / mineDuration) * diffTime);
                const actualSc = Math.floor((data.total_mined - scPerTime));

                if(nowTime < endTime){
                    setMinedSc(actualSc + 1);
                } else {
                    setMinedSc(total_mined);
                }
                
                setTotalSc(total_mined);
                setLockedSc(total_locked);
                setEndTime(endTime);
                setMinedScStatus(true);
                setIsReady(false);
                                    
            } catch(err){
                let message =  (err as Error).message;
                setError(message);

            } finally{
                setTimeout(() => {
                    setPerfect("");
                    setError("");
                }, 10 * 1000);
            }
        }, 0);
      
    }, []);

    // hide and reveal balance
    const hideRevealBalance = () => {
        setHideBal(! hideBal);
        if(hideBal){
            localStorage.setItem("hide-bal", "true");
        } else {
            localStorage.removeItem("hide-bal");
        }
    }
    const hideBalStatus = localStorage.getItem("hide-bal");

    // set error
    const [error, setError] = useState<string>("");

    const mineSCFn = async () => {
        try{
            setPerfect("");
            setError("");

            const {data, message} = await mineSc(true);

            const endTime = new Date(data.end_time).getTime(); 
            const total_mined = data.total_mined;
                      
            setEndTime(endTime);
            setTotalSc(total_mined);
            setMinedSc(Math.max(total_mined - mineRate, 0) + 1);
            setPerfect(message);
            setIsReady(false);

        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally {
            setTimeout(() => {
                setPerfect("");
                setError("");
            }, 10 * 1000);
        }
    }


    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )
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
                        <p className="">{user?.first_name} {user?.last_name}</p>
                    </div>
                </Link>
            </nav>
            <div className="logo-amt-eye">
                {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}
                {error && <Fail error={error} loggedinStatus={true} />}
                
                   <span className="mined-amt">
                         { 
                           !minedScStatus ? <h3>loading...</h3> :
                                <h2>
                                    {
                                        !hideBalStatus  ? minedSc.toFixed(2)                                                      
                                                        : "*****"
                                    } 
                                </h2>
                        }
                        <h3>SC</h3>
                    </span>
                <span className="iconx">
                    <i onClick={hideRevealBalance} className={!hideBalStatus ? "fa-solid fa-eye" : "fa-solid fa-eye-slash" }></i>
                </span>
            </div>
            <div className="lock-coin"> 
                <p>Level: {minedSc != 0 ? (1 + Math.floor((minedSc + lockedSc) / 100)) : 0}</p>
                <Link to={'/select-pkg'}>
                    <p>Locked: {!hideBalStatus  ? lockedSc : "***"} SC</p>
                </Link>
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
                    <Link to={'/referral'}>
                        <i className="fa-solid fa-share-nodes"></i>
                        <p>Referral</p>
                    </Link>
                </span>
            </div>
            <div className="pie-sidebutton">
                <div className="piechart-sec">
                    <span className="piechart_css">
                        {/* <img src={piechart} alt="piechart analysis" /> */}
                        <Piechart mined_sc={Number(minedSc.toFixed(2))} locked_sc={lockedSc} boast={1_000} />
                    </span>
                    
                    <ul>
                        <li>
                            total mine: {!hideBalStatus  ? minedSc.toFixed(2) : "*****"}
                        </li>
                        <li>
                            locked sc: {!hideBalStatus  ? lockedSc.toFixed(2) : "*****"}
                        </li>
                        <li>
                            Boast: 1,000
                        </li>                        
                    </ul>
                </div>
                <div className="db-sidebutton">
                    <span onClick={mineSCFn}>
                        <img className={endTime === null ? "" : "spin-img1"} src={mine} alt="mining logo" />
                    </span>
                    <span>
                        <Link to={'/select-pkg'}>
                            <img className={"lock-active1"} src={lock} alt="lock logo" />
                        </Link>
                    </span>
                    <span>
                        <Link to={'/update-profile'}>
                            <img src={update_prof} alt="update logo" />
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
 
export default Dashboard;