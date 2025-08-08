import { Link, useLocation, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import '../../css/page_css/user_css/register-pg.css';
import { useEffect, useState } from "react";
import Success from "../../components/alert/success";
import Fail from "../../components/alert/fail";
import { loginUser } from "../../controllers/user";

type FormDataType = {
    email: string,
    password?: string
}

const LoginPage = () => {

    // get items stored in localstorage
    const message_user = localStorage.getItem("message_user") ?? "";
    const message_no_user = localStorage.getItem("message_no_user") ?? "";

    useEffect(()=> {
        setTimeout(()=> {
            setPerfect("");
            localStorage.removeItem("message_user");
        }, 10 * 1000);
    }, []);

    const navigate = useNavigate();

    const [perfect, setPerfect] = useState<string>(message_user);

    const userString = localStorage.getItem("user");
    let email = "";

    if(userString){
        const userInfo = JSON.parse(userString!); 

        //input state
        email = userInfo?.email;
    }
    const location =  useLocation();
    email = location.state?.email_RP || "";

    const [formData, setFormData] = useState<FormDataType>({
        email: email,
        password: "",
    });

    //error state
    const [error, setError] = useState<string>(message_no_user);

    useEffect(()=> {
        setTimeout(()=> {
            setError("");
            localStorage.removeItem("message_no_user");
        }, 10 * 1000);
    }, []);

    // hide and reveal password
    const [revealPwdStatus, setRevealPwdStatus] = useState<boolean>(true);

    const hideRevealPassword = (clickID: number) => {
        if(clickID == 1) return setRevealPwdStatus(! revealPwdStatus);
    }

    // fn that handle register submit request
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        // to prevent page from reloading
        e.preventDefault();

        setError("");
        setPerfect("");

        // login user
        try{
            const data = await loginUser(formData);

            const {message, user_id} = data;

            localStorage.removeItem("user");
            localStorage.removeItem("message_user2");
            localStorage.setItem("message_user", message);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("reload", "true");
            navigate('/dashboard');

        } catch(err){
            let message =  (err as Error).message;
            if(message.includes("user not verified, please verify your account first!")){
                setError(message + "\r\n Redirecting...");
                setTimeout(() => {             
                    navigate('/verify');
                }, 10 * 1000);
                return;
            }
            setError(message);
            
        } finally {
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }

    }

    const handleForgetPwd = () => {
        navigate('/forget-password');
    }

    return ( 
        <div className="register-page login-page">
            <form onSubmit={handleLogin}>
                {perfect && <Success success={`${perfect}`} />}
                {error && <Fail error={error} />}
                <header className="header-text">Login</header>
                <div className="form-input-box login-form2">
                    <div>
                        <label>Email:</label>
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="text" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label>Password:</label>
                        <input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type={revealPwdStatus ? "password" : "text"} placeholder="********" />
                        <i onClick={() => hideRevealPassword(1)} className={revealPwdStatus ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </div>
                    <p onClick={handleForgetPwd} className="forgetPwd">forgot password?</p>
                </div>
                <div className="form-btn">
                    <PrimaryBtn btnText={"login"} />
                </div>
                <div className="form-social fs-login2">
                    <p>or</p>
                    <p>login with socials</p>
                    <ul>
                        <li>
                            <Link to={""} title={"facebook"}>
                                <i className="fa-brands fa-facebook icon-link"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} title={"google"}>
                                <i className="fa-brands fa-google icon-link"></i>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} title={"x-twitter"}>
                                <i className="fa-brands fa-x-twitter icon-link"></i>
                            </Link>
                        </li>
                    </ul>
                    <p>no account yet? Pls <Link to={"/register"} className="login-option">register</Link></p>
                </div>
            </form>
        </div>
    );
}
 
export default LoginPage;