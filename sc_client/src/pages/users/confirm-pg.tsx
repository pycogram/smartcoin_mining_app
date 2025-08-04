import "../../css/page_css/user_css/confirm-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import confirm_pic from "../../images/pics/verify-illustraction.png";
import { useEffect, useState } from "react";
import Fail from "../../components/alert/fail";
import { confirmUser } from "../../controllers/user";
import { useLocation, useNavigate } from "react-router-dom";
import Success from "../../components/alert/success";

const ConfirmPage = () => {
    // get items stored in localstorage
    const userString = localStorage.getItem("user");
    const locate = useLocation();
    const message_user =  locate.state ?? "";
    
    localStorage.removeItem("message_user");

    useEffect(() => {
        if(!userString){
            localStorage.setItem("message_no_user", "Please either login or register");
            navigate('/login');
        }
    }, []);

    const [perfect, setPerfect] = useState<string>(message_user);
    if(perfect){
        setTimeout(() => {
            setPerfect("");
        }, 10 * 1000);
    }

    // set value entered by the user
    const [codeForm, setCodeForm] = useState({
        item1: "", item2: "", item3: "", item4: "", item5: "", item6: ""
    });

    // join the values together
    const code = [
        codeForm.item1, codeForm.item2, codeForm.item3 ,
        codeForm.item4, codeForm.item5, codeForm.item6
    ].join("");
    
    // error state
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    // handle erase
    const handleErase = () => {
        setCodeForm({
            item1: "", item2: "", item3: "", item4: "", item5: "", item6: ""
        });
        setError("");
        setPerfect("");
    }
    // handle copy from clipboard
    const handleCopy = async () => {
        setError("");
        setPerfect("");

        try{
            const copyText = await navigator.clipboard.readText();
            if(copyText.length !== 6){
                return setError("You can only paste 6(six) characters")
            }
            const arrT = copyText.split("");
            setCodeForm({
                item1: `${arrT[0]}`, item2: `${arrT[1]}`, 
                item3: `${arrT[2]}`, item4: `${arrT[3]}`, 
                item5: `${arrT[4]}`, item6: `${arrT[5]}`
            });
        }catch(err){
            setError(`${(err as Error).message}`);
        }
    }

    const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPerfect("");
        setError("");

        // confirm user
        try{
            const userString = localStorage.getItem("user");
            const user = JSON.parse(userString!);
            const {id} = user;

            const data = await confirmUser(code, id);
            const {message} = data; 

            localStorage.setItem("message_user", message);
            localStorage.removeItem("message_user2");
            navigate('/login');

        } catch(err){
            setError(`${(err as Error).message}`);
        }

    }
    if(!userString){return}
    return ( 
        <div className="container">
            <div className="confirm-page">
                <form onSubmit={handleConfirm}>
                    {perfect && <Success success={`${perfect}`} />}
                    {error && <Fail error={error} />}
                    <header>Enter code:</header>
                    <div className="input-box">
                        <input value={codeForm.item1} onChange={(e) => setCodeForm({...codeForm, item1: e.target.value})} type="text" maxLength={1} />
                        <input value={codeForm.item2} onChange={(e) => setCodeForm({...codeForm, item2: e.target.value})} type="text" maxLength={1} />
                        <input value={codeForm.item3} onChange={(e) => setCodeForm({...codeForm, item3: e.target.value})} type="text" maxLength={1} />
                        <input value={codeForm.item4} onChange={(e) => setCodeForm({...codeForm, item4: e.target.value})} type="text" maxLength={1} />
                        <input value={codeForm.item5} onChange={(e) => setCodeForm({...codeForm, item5: e.target.value})} type="text" maxLength={1} />
                        <input value={codeForm.item6} onChange={(e) => setCodeForm({...codeForm, item6: e.target.value})} type="text" maxLength={1} />
                    </div>
                    <div className="input-btn">
                        <i onClick={handleErase} className="fa-solid fa-eraser icon-btn"></i>
                        <i onClick={handleCopy} className="fa-regular fa-paste icon-btn"></i>
                    </div>
                    <img src={confirm_pic} alt="confirm pic" />
                    <div className="for-secondary-btn">
                        <SecondaryBtn text_1={"Go back"} text_2={"Confirm"} link_1={"/verify"} />
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default ConfirmPage;