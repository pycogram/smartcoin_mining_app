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
    const message_user = localStorage.getItem("message_user2") ?? "";

    useEffect(() => {
        if(!userString){
            localStorage.setItem("message_no_user", "Please either login or register");
            navigate('/login');
        }
    }, [userString]);
    
    const userInfo = JSON.parse(userString!); 

    //input state
    const first_name = userInfo?.first_name;
    const email = userInfo?.email;

    //error state
    const [error, setError] = useState<string>("");    

    const handleVerify = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        // verify user
        try{ 
            const data = await verifyUser(email);
            console.log(12, data, data.message);
            const {message} = data;
            setTimeout(() => {
              navigate('/confirm', { state: message });
            }, 2 * 1000);
            
        } catch(err){
            const message = (err as Error).message;
            if (message.includes("before requesting for another code")) {
                setError(`${message}. ...You will be redirected shortly`);
                setTimeout(() => {
                    navigate('/confirm', {state: "Enter the code sent to your email address"});
                }, 5 * 1000);
                return;
            }
            setError(message);

        } finally {
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
            
        }
    }

    if(!userString){return}
    return ( 
        <div className="verify-page">
            <form onSubmit={handleVerify}> 
                <header className="header-text">Verify</header>
                {error && <Fail error={error} />}
                <p className="verify-info">
                    Hi, <b>{first_name}</b>. {message_user}. 
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
