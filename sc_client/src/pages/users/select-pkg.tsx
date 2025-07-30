import "../../css/page_css/user_css/select-pkg.css";
import stoneImg from "../../images/pics/stone.jpeg";
import graniteImg from "../../images/pics/granite.jpeg";
import bronzeImg from "../../images/pics/bronze.jpeg";
import silverImg from "../../images/pics/silver.jpeg";
import diamondImg from "../../images/pics/diamond.jpeg";
import goldImg from "../../images/pics/gold.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Success from "../../components/alert/success";
import Fail from "../../components/alert/fail";
import { mineDetail } from "../../controllers/miner";
import { format } from 'date-fns';
import { unLockSc } from "../../controllers/lock";

const SelectPkg = () => {
    const navigate = useNavigate();

    const message_user = localStorage.getItem("message_user") ?? "";

    const [perfect, setPerfect] = useState<string>(message_user);
    const [error, setError] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(true);
    const [isLocked, setIsLocked] = useState<number | null>(null);
    const [isUnLockTime, setIsUnLockTime] = useState<Date | null>(null);

    useEffect(() => {
        setTimeout(()=> {
            setPerfect("");
            localStorage.removeItem("message_user");
        }, 10 * 1000);

        try {
            setTimeout( async () => {
                const {data} = await mineDetail();
                const total_locked = data.total_locked;
                const unlock_time = data.unlock_time;

                setIsUnLockTime(unlock_time);
                setIsLocked(total_locked);
                setIsReady(false);
            }, 0)

        } catch(err) {
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }        

    }, [])

    const handleSeleckPkg = (value : number) => {
        setPerfect("");

        localStorage.setItem("lock_time", `${value}`);
        setTimeout(() => {
            navigate('/lock-pkg');
        }, 1 * 1000);
    }

    const handleUnlock = async() => {
        try{
            const {message} = await unLockSc(true);
           
            setIsUnLockTime(null);
            setIsLocked(0);
            
            setPerfect(message);
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
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
        <div className="page-boxx">
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}
            {error && <Fail error={error} loggedinStatus={true} />}

            <div className="select-pkg">
                <h3 className="a-pkg-h3">{isLocked && isLocked > 0  ? `active lock` : `no active lock`}</h3>
                <div className="active-lock">
                    <p>total locked: SC {isLocked && isLocked.toFixed(2)}</p>
                    {/* ${format(unlockTime, "EEEE, MMMM do yyyy, h:mm:ss a")} */}
                    <p>{isUnLockTime && isLocked ?  `time unlock: ${format(isUnLockTime, "EEEE, MMMM do, h:mm:ss")} ` : ``}</p>
                    {isLocked ? <h5 onClick={handleUnlock}>unlock</h5> : ``}
                </div>
                <h3 className="s-pkg-h3">select package </h3>
                <div className="select-lock-pkg">
                    <div onClick={() => handleSeleckPkg(6)} className="each-pkg">
                        <span>
                            <h4>gold</h4>
                            <img src={goldImg} alt="gold package image" />
                        </span>
                        <span>
                            <h2>6 hours</h2>
                            <h3>220% returns</h3>
                        </span>
                    </div>
                    <div onClick={() => handleSeleckPkg(2)} className="each-pkg">
                        <span>
                            <h4>granite</h4>
                            <img src={graniteImg} alt="granite package image" />
                        </span>
                        <span>
                            <h2>2 hours</h2>
                            <h3>140% returns</h3>
                        </span>
                    </div>
                    <div onClick={() => handleSeleckPkg(5)} className="each-pkg">
                        <span>
                            <h4>diamond</h4>
                            <img src={diamondImg} alt="diamond package image" />
                        </span>
                        <span>
                            <h2>5 hours</h2>
                            <h3>200% returns</h3>
                        </span>
                    </div>
                    <div onClick={() => handleSeleckPkg(3)} className="each-pkg">
                        <span>
                            <h4>bronze</h4>
                            <img src={bronzeImg} alt="bronze package image" />
                        </span>
                        <span>
                            <h2>3 hours</h2>
                            <h3>160% returns</h3>
                        </span>
                    </div>
                    <div onClick={() => handleSeleckPkg(4)} className="each-pkg">
                        <span>
                            <h4>silver</h4>
                            <img src={silverImg} alt="silver package image" />
                        </span>
                        <span>
                            <h2>4 hours</h2>
                            <h3>180% returns</h3>
                        </span>
                    </div>
                    <div onClick={() => handleSeleckPkg(1)} className="each-pkg">
                        <span>
                            <h4>stone</h4>
                            <img src={stoneImg} alt="stone package image" />
                        </span>
                        <span>
                            <h2>1 hour</h2>
                            <h3>120% returns</h3>
                        </span>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default SelectPkg;