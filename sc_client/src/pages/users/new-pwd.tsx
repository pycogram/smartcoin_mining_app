import '../../css/page_css/user_css/register-pg.css';
import Success from "../../components/alert/success";
import Fail from "../../components/alert/fail";
import PrimaryBtn from '../../components/button/primary-btn';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newPassword } from '../../controllers/user';

type FormDataType = {
    password: string,
    confirmed_password: string,
    forget_pwdc: string | null
}

const NewPwdPage = () => {

    const pwdCodeLink  = new URLSearchParams(window.location.search).get('link');

    useEffect(() => {
        if (!pwdCodeLink || pwdCodeLink.length !== 15) {
            setError("Invalid link: Make use of the correct link sent to your email address");
        }
    }, [pwdCodeLink]);

    const [formData, setFormData] = useState<FormDataType>({
        password: "",
        confirmed_password: "",
        forget_pwdc: pwdCodeLink || ""
    });

    //error state
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");
    const [sending, setSending] = useState<boolean | null>(null);

    const navigate = useNavigate();
    const handleForgetPwd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPerfect("");
        setSending(true);
               
        try{         
            const {message, email} = await newPassword(formData);
            setPerfect(message + " ... You will be redirected to login page");

            if(email){
                setTimeout(()=> {
                    navigate("/login", {state: {'email_RP': email}});
                }, 10 * 1000);
            }
            
        } catch(err){
            setError((err as Error).message);

        } finally{
            setTimeout(()=> {
                setSending(null);
            }, 3 * 1000);
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }
    }

    // hide and reveal password

    const [revealPwdStatus, setRevealPwdStatus] = useState<boolean>(true);
    const [revealPwdStatus2, setRevealPwdStatus2] = useState<boolean>(true);

    const hideRevealPassword = (clickID: number) => {
        if(clickID == 1) return setRevealPwdStatus(! revealPwdStatus);
        if(clickID == 2) return setRevealPwdStatus2(! revealPwdStatus2);
    }

    const handleReqNewLink = () => {
        navigate('/forget-password')
    }

    return ( 
        <div className="register-page login-page">
            <form onSubmit={handleForgetPwd}>
                {perfect && <Success success={`${perfect}`} />}
                {error && <Fail error={error} />}
                <header className="header-text">Reset Password</header>
                <div className="form-input-box login-form2">
                    <div>
                        <label>New Password:</label>
                        <input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type={revealPwdStatus ? "password" : "text"} placeholder="********" />
                        <i onClick={() => hideRevealPassword(1)} className={revealPwdStatus ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input value={formData.confirmed_password} onChange={(e) => setFormData({...formData, confirmed_password: e.target.value})} type={revealPwdStatus2 ? "password" : "text"} placeholder="********" />
                        <i onClick={() => hideRevealPassword(2)} className={revealPwdStatus2 ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </div>
                    <p onClick={handleReqNewLink} className="forgetPwd">Request new link</p>
                </div>
                <div className="form-btn">
                    <PrimaryBtn btnText={!sending ? "reset password" : "loading..."} />
                </div>
            </form>
        </div>
    );
}
 
export default NewPwdPage;