import SecondaryBtn from "../../components/button/secondary-btn";
import "../../css/page_css/user_css/select-pkg.css";
import "../../css/page_css/user_css/send-sc.css";
import stoneImg from "../../images/pics/stone.jpeg";
import graniteImg from "../../images/pics/granite.jpeg";
import bronzeImg from "../../images/pics/bronze.jpeg";
import silverImg from "../../images/pics/silver.jpeg";
import diamondImg from "../../images/pics/diamond.jpeg";
import goldImg from "../../images/pics/gold.png";
import { useEffect, useState } from "react";
import { mineDetail } from "../../controllers/dashboard";
import { lockSc } from "../../controllers/lock";
import Fail from "../../components/alert/fail";
import { Link, useNavigate } from "react-router-dom";

const LockPkg = () => {
    const mineRate = 30;
    const mineDuration = 2400;
    const navigate = useNavigate();

    // set error
    const [error, setError] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(true);

    const [availSC, setAvailSc] = useState<number | null>(null);

    useEffect(() => {
        setTimeout( async ()=> {
            try{
                const {data} = await mineDetail();
                const endTime = new Date(data.end_time).getTime();
                const total_mined = data.total_mined;
                const nowTime = Date.now();
                const diffTime =  Math.floor((nowTime - endTime) / 1000);
                const scPerTime = Math.abs((mineRate / mineDuration) * diffTime);
                const actualSc = Math.floor((data.total_mined - scPerTime));

                if(nowTime < endTime){
                    setAvailSc(actualSc + 1);
                } else {
                    setAvailSc(total_mined);
                }

                setIsReady(false);

            } catch(err) {
                let message = (err as Error).message;
                setError(message);

            } finally{
                setTimeout(() => {
                    setError("");
                }, 10 * 1000);
            }
        }, 0)
    }, []);

    let lockTime = Number(localStorage.getItem("lock-time"));
    let lockImg =  undefined;
    let lockName = undefined;

    switch (lockTime) {
        case 1:
            lockImg = stoneImg; lockName = "stone";
            break;
        case 2:
            lockImg = graniteImg; lockName = "granite";
            break;
        case 3: 
            lockImg = bronzeImg; lockName = "bronze";
            break;
        case 4: 
            lockImg = silverImg; lockName = "silver";
            break;
        case 5: 
            lockImg = diamondImg; lockName = "diamond";
            break;
        case 6: 
            lockImg = goldImg; lockName = "gold";
            break;
        default:
            break;
    }
    const [amountSc, setAmountSc] = useState<number | string>("");

    const calReturn = (120/100 * lockTime * Number(amountSc)) + Number(amountSc);

    const maxHandle = () => {
        if(availSC){
            setAmountSc(availSC)
        }
    }

    const handleLockPkg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const lock_sc = Math.round(Number(amountSc));
        const lock_period = lockTime;

        try {
            const {message} = await lockSc(lock_sc, lock_period);
            localStorage.removeItem("lock-time");
            localStorage.setItem("message_user", `${message}`);
            setTimeout(() => {
                navigate('/select-pkg');
            }, 1000);

        } catch(err) {
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
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
            <div className="send-sc lock-pkg-sc">
                {error && <Fail error={error} loggedinStatus={true} />}
                <form onSubmit={handleLockPkg}>
                    <Link to={'/select-pkg'}>
                        <span className="ref-span-go-back">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>
                    </Link>
                    <div className="select-lock-pkg lock-pkg">
                        <div className="each-pkg">
                            <span>
                                <h4>~ {lockName} ~</h4>
                                <img src={lockImg} alt={`${lockName} package image`} />
                            </span>
                            <span>
                                <h2>{lockTime} hour</h2>
                                <h3>120 percent * Hour * Sc</h3>
                            </span>
                        </div>
                        <div className="w-addy">
                            <h3>amount</h3>
                            <span>
                                <input value={amountSc} onChange={(e) => setAmountSc(e.target.value)} type="number" placeholder="500" />
                                <i>SC</i>
                            </span>
                            <div>
                                <p onClick={maxHandle}>max</p>
                                <p>avail: {availSC} SC</p>
                            </div>
                        </div>
                        <div className="w-info">
                            <span>
                                <p>{calReturn ? `${calReturn.toFixed(2)} SC will be returned after ${lockTime} ${lockTime > 1 ? "hours" : "hour" }` : `Enter the amount you want to lock.`}</p>
                            </span>
                        </div>
                        <div className="w-button">
                            <SecondaryBtn text_1="go back" text_2="lock" link_1={'/select-pkg'} />
                        </div>
                    </div>
                </form>
            </div>
    );
}
 
export default LockPkg;