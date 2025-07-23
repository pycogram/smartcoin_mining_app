import "../../css/page_css/user_css/referral.css";
import "../../css/page_css/user_css/register-pg.css";
import { useEffect, useState } from "react";
import { claimRefBonus, referralDetail } from "../../controllers/referral";
import Fail from "../../components/alert/fail";
import { Link } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import Success from "../../components/alert/success";

type ReferralType = {
    first_name: string,
    last_name: string,
    user_name: string
}
type DownLineType = {
    _id: string
    user: ReferralType,
    upline_gain: number
}

const Referral = () => {
    const [totalBonus, setTotalBonus] = useState<number>(0);
    const [claimBonus, setClaimBonus] = useState<number>(0);
    const [listDL, setListDL] = useState<DownLineType[]>([]);
    const [refLink, setRefLink] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");

    const regFullLink = `${window.location.protocol}//${window.location.host}/register?${refLink}`;

    

    useEffect(() => {
        setTimeout(async () => {
            try{
                const {ref_info, ref_list} = await referralDetail();
                
                setTotalBonus(ref_info.total_bonus);
                setClaimBonus(ref_info.claim_bonus);
                setRefLink("ref=" + ref_info.ref_link)
                setListDL(ref_list)
                           
            } catch(err){
                let message =  (err as Error).message;
                setError(message);
                
            } finally{
                setTimeout(() => {
                    setError("");
                }, 10 * 1000);
            }
        }, 0)
    }, []);

    // handle copy from clipboard
    const handleCopy = async () => {
        try{
            await navigator.clipboard.writeText(regFullLink);
            setPerfect(`referral link copied`);                
        }catch(err){
            setError(`${(err as Error).message}`);

        } finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
            }, 5 * 1000);
        }
    }

    const handleClaim =  async () => {
        setPerfect("");
        setError("");

        try{
            const {message} = await claimRefBonus(true);
            setPerfect(message);
            setClaimBonus(0);
            
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

    return ( 
        <div className="referral">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}

            <span className="ref-span-go-back">
                <Link to={'/dashboard'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Link>
            </span>
            <div className="ref-wallet-ady">
                <h3>Referral link</h3>
                <div>
                    <span>
                        <h4>...{refLink}</h4>
                        <i onClick={handleCopy} className="fa-solid fa-copy"></i>
                    </span>
                </div>
            </div>
            <div className="total-claim-sc">
                <div className="ref-link">
                    <h3>total bonus</h3>
                    <div>
                        <span>
                            <h4 className="unclaimed-figure">{totalBonus} sc</h4>
                        </span>
                    </div>
                </div>            
                <div className="ref-link">
                    <h3>unclaimed bonus</h3>
                    <div>
                        <span>
                            <h4 className="unclaimed-figure unclaimed-figure2">{claimBonus} sc</h4>
                            <p onClick={handleClaim}>claim</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className="ref-invite">
                <h3 style={{textTransform: "lowercase"}}>{listDL ? listDL.length : 0} invites</h3>
                <ul>
                    {
                        listDL && listDL.map((item, index) => 
                            <li key={item._id}>
                                <p>{index + 1}</p>
                                <h4>{item.user.first_name} {item.user.last_name ||  "( " + item.user.user_name + " )"}</h4>
                                <i>{item.upline_gain} SC</i>

                            </li> 
                        )    
                    }
                </ul>
            </div>
            <div className="form-btn">
                <Link to={'/dashboard'}>
                    <PrimaryBtn btnText={"Go Back"} />
                </Link>
            </div>           
        </div>    
    );
}
 
export default Referral;