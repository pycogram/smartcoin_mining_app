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
import { mineDetail, mineSc} from "../../controllers/miner";
import { walletId } from "../../controllers/wallet";
import Fail from "../../components/alert/fail";
import "../../css/page_css/user_css/referral.css";
import { referralDetail } from "../../controllers/referral";


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
    const [totalReceived, setTotalReceived] = useState<number>(0);
    const [totalSent, setTotalSent] = useState<number>(0);
    const [totalBonus, setTotalBonus] = useState<number>(0);

    const [walletAddy, setWalletAddy] = useState<string | null>(null);

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

    const [theme, setTheme] = useState<string>("light");
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme); 
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    }

    useEffect(()=> {

        const storedTheme = localStorage.getItem("theme") || "light";
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");

        const reload = Number(localStorage.getItem("reload"));
        if(reload && reload == 1){
            setTimeout(() => {
                localStorage.removeItem("reload");
                window.location.href = "/dashboard";
            }, 100);
        }

        setTimeout(()=> {
            setPerfect("");
            localStorage.removeItem("message_user");
        }, 5 * 1000);

        const fetchData = async () => {
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

                const {ref_info} = await referralDetail();
                setTotalBonus(ref_info.total_bonus);

                // get wallet ID and info
                const {wallet_info} = await walletId();

                setTotalReceived(wallet_info.total_received);
                setTotalSent(wallet_info.total_sent)
                setWalletAddy(wallet_info.wallet_id);

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
        }

        fetchData();

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

    const [viewW, setViewW] = useState<boolean | null>(null);

    const viewWalletId = () => {
        setPerfect("");
        setError("");
        
        try{
            setViewW(true);
            setTimeout(async() => {
                if(walletAddy){
                    await navigator.clipboard.writeText(walletAddy);
                    setPerfect(`wallet address automatically copied`);
                }
            });
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setViewW(prev => !prev);
                setError("");
                setPerfect("");

            }, 5 * 1000);
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
                    <Link to={"/history"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </Link>
                    <div onClick={toggleTheme}>
                        {
                            theme === "light" ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="nav-option">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                        }
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
                <p>Level : {minedSc != 0 ? (1 + Math.floor((minedSc + lockedSc) / 100)) : 0}</p>
                <Link to={'/select-pkg'}>
                    <p>Locked : {!hideBalStatus  ? lockedSc : "***"} SC</p>
                </Link>
            </div>
            {   ! viewW ?
                <div className="db-button">
                    <span>
                        <Link to={'/send-sc'}>
                            <i className="fa-solid fa-paper-plane"></i>
                            <p>Send</p>
                        </Link>
                    </span>
                    <span onClick={viewWalletId}>
                        <i className="fa-solid fa-repeat"></i>
                        <p>Receive</p>
                    </span>
                    <span>
                        <Link to={'/referral'}>
                            <i className="fa-solid fa-share-nodes"></i>
                            <p>Referral</p>
                        </Link>
                    </span>
                </div> :
                <div className="ref-wallet-ady">
                    {/* <h3>wallet Address</h3> */}
                    <div>
                        <span>
                            <h4 className="ref-w-a-h4" >{walletAddy ?? "loading.."}</h4>
                            <i className="fa-solid fa-copy"></i>
                        </span>
                    </div>
                </div> 
            }
            <span className="db-board"></span>
            <div className="pie-sidebutton">
                <div className="piechart-sec">
                    <span className="piechart_css">
                        {/* <img src={piechart} alt="piechart analysis" /> */}
                        <Piechart 
                            mined_sc={Number(minedSc.toFixed(2))} 
                            locked_sc={lockedSc} 
                            total_received={totalReceived}
                            total_sent={totalSent} 
                            total_bonus={totalBonus}
                        />
                    </span>
                    
                    <ul>
                        <li>
                            Mined: {!hideBalStatus  ? minedSc.toFixed(2) + " SC" : "*****"}
                        </li>
                        <li>
                            Locked: {!hideBalStatus  ? lockedSc.toFixed(2) + " SC"  : "*****"}
                        </li>
                        <li>
                            Received: {!hideBalStatus ? totalReceived.toFixed(2) + " SC"  : "*****"}
                        </li> 
                        <li>
                            Sent: {!hideBalStatus ? totalSent.toFixed(2) + " SC"  : "*****"}
                        </li>      
                        <li>
                            Bonus: {!hideBalStatus ? totalBonus.toFixed(2) + " SC"  : "*****"}
                        </li>                    
                    </ul>
                </div>
                <div className="db-sidebutton">
                    <span onClick={mineSCFn}>
                        <img className={endTime === null ? "" : "spin-img1"} src={mine} alt="mining logo" />
                        <p>mine sc</p>
                    </span>
                    <span>
                        <Link to={'/select-pkg'}>
                            <img className={"lock-active1"} src={lock} alt="lock logo" />
                            <p>lock sc</p>
                        </Link>
                    </span>
                    <span>
                        <Link to={'/update-profile'}>
                            <img src={update_prof} alt="update logo" />
                            <p>profile</p>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
 
export default Dashboard;