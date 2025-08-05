import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import "../../css/page_css/user_css/register-pg.css";
import React, { useEffect, useState } from "react";
import { registerUser } from "../../controllers/user";
import Fail from "../../components/alert/fail";

const RegisterPage = () => {
    const userDelete = localStorage.getItem("user_delete") ?? "";

    //error state
    const [error, setError] = useState<string | null>(userDelete);

    useEffect(()=> {
        if(! userDelete) return;
        localStorage.removeItem("user_delete");

        setTimeout(() => {
            setError(null);
        }, 10 * 1000);

    }, []);
    
    const refLink  = new URLSearchParams(window.location.search).get('ref');
    
    // input state
    const [formData, setFormData] = useState({
        first_name: "",
        email: "",
        password: "",
        confirmed_password: "",
        upline_link2: refLink
    });

    // use navigate model
    const navigate = useNavigate();

    // hide and reveal password

    const [revealPwdStatus, setRevealPwdStatus] = useState<boolean>(true);
    const [revealPwdStatus2, setRevealPwdStatus2] = useState<boolean>(true);

    const hideRevealPassword = (clickID: number) => {
        if(clickID == 1) return setRevealPwdStatus(! revealPwdStatus);
        if(clickID == 2) return setRevealPwdStatus2(! revealPwdStatus2);
    }

    // fn that handle register submit request
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {

        // to prevent page from reloading
        e.preventDefault();
        setError("");

        // register user
        try{
            const data = await registerUser(formData);

            const {id, first_name, email, message} = data;
            
            localStorage.setItem("user", JSON.stringify({id, first_name, email}));
            localStorage.setItem("message_user", message);
            navigate('/verify');

        } catch(err){
            setError(`${(err as Error).message}`);

        } finally {
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }
    }
    return ( 
        <div className="register-page">
            <form onSubmit={handleRegister}>
                <header className="header-text">Register</header>
                {error && <Fail error={error} />}
                <div className="form-input-box">
                    <div>
                        <label>First name:</label>
                        <input value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} type="text" placeholder="John"/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="text" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label>Password:</label>
                        <input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type={revealPwdStatus ? "password" : "text"} placeholder="********" />
                        <i onClick={() => hideRevealPassword(1)} className={revealPwdStatus ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </div>
                    <div>
                        <label>Confirm password:</label>
                        <input value={formData.confirmed_password} onChange={(e) => setFormData({...formData, confirmed_password: e.target.value})} type={revealPwdStatus2 ? "password" : "text"} placeholder="********" />
                        <i onClick={() => hideRevealPassword(2)} className={revealPwdStatus2 ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </div>
                </div>
                <div className="form-btn">
                    <PrimaryBtn btnText={"register"} />
                </div>
                <div className="form-social">
                    <p>or</p>
                    <p>register with socials</p>
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
                    <p>already have an account? Pls <Link to={"/login"} className="login-option">login</Link></p>
                </div>
            </form>
        </div>
    );
}
 
export default RegisterPage;