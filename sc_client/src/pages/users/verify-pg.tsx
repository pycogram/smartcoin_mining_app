import "../../css/page_css/user_css/verify-pg.css";
import SecondaryBtn from "../../components/button/secondary-btn";
import verify_pic from "../../images/pics/verify-illustraction.png";
import { useNavigate } from "react-router-dom";
import Fail from "../../components/alert/fail";
import { useEffect, useState } from "react";
import { verifyUser } from "../../controllers/user";

const VerifyPage = () => {
    const navigate = useNavigate();

    // get items stored in localstorage
    const userString = localStorage.getItem("user");

    useEffect(() => {
        if(!userString){
            navigate('/register', {state: {message: "Please either register or login"}});
        }
    }, []);
    
    const userInfo = JSON.parse(userString!); 

    //input state
    const first_name = userInfo?.first_name;
    const email = userInfo?.email;

    //error state
    const [error, setError] = useState<string>("");    

    if(error){
        setTimeout(() => {
            setError("");
        }, 10 * 1000)
    }

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setError("");

        // register user
        try{ 
            const data = await verifyUser(email);

            const {message} = data;
            navigate('/confirm', {state: message});

        } catch(err){
            setError(`${(err as Error).message}`);
        }
    }

    return ( 
        <div className="verify-page">
            <form onSubmit={handleVerify}> 
                <header className="header-text">Verify</header>
                {error && <Fail error={error} />}
                <p className="verify-info">
                    Hi, <b>{first_name}</b>. Your account has been registered succesfully. 
                    In order to make use of your account <b><i> " {email} " </i></b>. 
                    Please hit the verify button to receive email verification code.
                </p>
                <img src={verify_pic} alt="" />
                <div className="for-secondary-btn">
                    <SecondaryBtn text_1={"Go back"} text_2={"Verify"} link_1={"/register"} />
                </div>
            </form>
        </div>
    );
}

export default VerifyPage;