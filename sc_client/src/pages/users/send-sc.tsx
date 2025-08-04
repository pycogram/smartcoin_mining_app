import "../../css/page_css/user_css/send-sc.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import { useEffect, useState } from "react";
import Fail from "../../components/alert/fail";
import { mineDetail } from "../../controllers/miner";
import { confirmUserWallet, sendSc } from "../../controllers/wallet";
import Success from "../../components/alert/success";
import { Link } from "react-router-dom";

const SendCoin = () => {
    const mineRate = 30;
    const mineDuration = 2400;

    // set error
    const [error, setError] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(true);
    const [availSC, setAvailSc] = useState<number | null>(null);
    const [perfect, setPerfect] = useState<string>("");

    const updateAvailSc = async () => {
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
                setFormInput({ wallet_id: "", amount_sc: 0 });
            }, 4 * 1000)

            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }
    }

    useEffect(() => {
        updateAvailSc();  
    }, []);

    // about wallet
    const [formInput, setFormInput] = useState({
        wallet_id: "",
        amount_sc: 0
    });

    const maxHandle = () => {
        if(availSC){
            setFormInput({...formInput, amount_sc: availSC});
        }
    }
    

    const [confirmReceiverWI, setConfirmReceiverWI] = useState<string | null>(null);

    useEffect(()=> {
        
        if(typeof formInput.wallet_id === "string" && formInput.wallet_id.length === 20){
            const wallet_id = formInput.wallet_id;

            setTimeout(async () => {
                try{
                    const {message} = await confirmUserWallet(wallet_id);
                    setConfirmReceiverWI(message);

                } catch(err) {
                    let message = (err as Error).message;
                    setConfirmReceiverWI(message);

                } finally{
                    setTimeout(() => {
                        setError("");
                    }, 10 * 1000);
                    
                }
            }, 0);

        } else {
            setConfirmReceiverWI(null);
        } 
        
    }, [formInput.wallet_id]);

    // handle erase
    const handleErase = () => {
        setPerfect("");
        setError("");
        setFormInput({...formInput, wallet_id: ""});
    }

    // handle copy from clipboard
    const handlePaste = async () => {
        setPerfect("");
        setError("");

        try{
            const pasteText = await navigator.clipboard.readText();
            if(pasteText.length !== 20){
                return setError("You can only paste 20 characters")
            }

            setFormInput({...formInput, wallet_id: pasteText});

        }catch(err){
            setError(`${(err as Error).message}`);

        } finally{
            
            setTimeout(()=> {
                setError("");
            }, 2 * 1000);
        }
    }


    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const wallet_id = formInput.wallet_id;
            const amount_sc = formInput.amount_sc;
            
            if(! wallet_id || ! amount_sc){
                throw new Error("all field is required");
            }
            if(wallet_id.length !== 20){
                throw new Error("wallet address must be 20 characters");
            }
            if(amount_sc < 1){
                throw new Error("amount should be minimum of 1");
            }
            
            const {message} = await sendSc(wallet_id, amount_sc);
            setPerfect(message);
            updateAvailSc();

        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
            }, 5 * 1000);
        }
    }

    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

    return ( 
        <div className="send-sc">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}

            <form onSubmit={handleSend}>
                <span className="ref-span-go-back">
                    <Link to={'/dashboard'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Link>
                </span>
                <div className="w-addy">
                    <h3>wallet ID</h3>
                    <span>
                        <input value={formInput.wallet_id} onChange={(e) => setFormInput({...formInput, wallet_id: e.target.value})} type="text" placeholder="678gb178t88y92187y1" />
                        <i onClick={handlePaste} className="fa-solid fa-copy"></i>
                        <i onClick={handleErase} className="fa-solid fa-xmark iconxw"></i>
                    </span>
                </div>
                <div className="w-addy">
                    <h3>amount</h3>
                    <span>
                        <input value={formInput.amount_sc === 0 ? "" : formInput.amount_sc} onChange={(e) => setFormInput({...formInput, amount_sc: Number(e.target.value)})} type="number" placeholder="500" />
                        <i>SC</i>
                    </span>
                    <div>
                        <p onClick={maxHandle}>max</p>
                        <p>avail: {availSC} SC</p>
                    </div>
                </div>
                <div className="w-info">
                    <h3>user info</h3>
                    <span>
                        <p>{confirmReceiverWI ? confirmReceiverWI :`Enter the complete wallet address to confirm user`}</p>
                    </span>
                </div>
                <div className="w-button">
                    <SecondaryBtn text_1="cancel" text_2="process" link_1={'/dashboard'} />
                </div>
            </form>
        </div>
     );
}
 
export default SendCoin;