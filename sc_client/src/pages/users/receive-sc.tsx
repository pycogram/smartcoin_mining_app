import { useState } from "react";
import "../../css/page_css/user_css/referral.css";
import receive_sc_pic from "../../images/pics/receive-sc-illustraction.png";
import Success from "../../components/alert/success";
import Fail from "../../components/alert/fail";
import { Link, useLocation } from "react-router-dom";

const ReceiveCoin = () => {

    const [wIClick, setWIClick] = useState<boolean | null>(null);
    const [perfect, setPerfect] = useState<string>("");
    const [error, setError] = useState<string>("");
    const location = useLocation();
    console.log(location);
    const walletAddy = location.state.wallet_id || "";

    const viewWalletId = () => {
        setPerfect("");
        setError("");
        
        try{
            setWIClick(true);
            setTimeout(async() => {
                if(walletAddy){
                    await navigator.clipboard.writeText(walletAddy);
                    setPerfect(`wallet address copied`);
                }
            });
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setWIClick(null);
                setError("");
                setPerfect("");

            }, 5 * 1000);
        }
    }


    return ( 
        <div className="referral">
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}
            {error && <Fail error={error} loggedinStatus={true} />}
            <Link to="/dashboard">
                <span className="ref-span-go-back">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </span>
            </Link>
            <div className="ref-wallet-ady">
                <h3>wallet ID</h3>
                <div>
                    <span onClick={viewWalletId}>
                        <h4>{walletAddy}</h4>
                        <i className={!wIClick ? "fa-solid fa-copy": "fa-solid fa-check"}></i>
                    </span>
                </div>
            </div>
            {/* <div className="ref-wallet-ady">
                <div>
                    <span>
                        <h4 className="ref-w-a-h4" >{walletAddy ?? "loading.."}</h4>
                        <i className="fa-solid fa-copy"></i>
                    </span>
                </div>
            </div>  */}
            <img className="ref-img3" src={receive_sc_pic} alt="receive sc pic" /> 
        </div>
     );
}
 
export default ReceiveCoin;