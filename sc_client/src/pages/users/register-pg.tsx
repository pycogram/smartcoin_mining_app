import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import "../../css/page_css/user_css/register-pg.css";
import React, { useState } from "react";
import { registerUser } from "../../controllers/user";
import Fail from "../../components/alert/fail";

const RegisterPage = () => {
    // input state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        invited_by: "",
        password: "",
        confirmed_password: ""
    });

    //error state
    const [error, setError] = useState("");

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

        //time to set error to empty string 
        setTimeout(() => {
            setError("");
        }, 10 * 1000);     

        // register user
        try{
            const data = await registerUser(formData);

            const {first_name, email} = data;
            navigate('/verify', {state: {first_name, email}});

        } catch(err){
            setError(`${(err as Error).message}`)
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
                        <label>Last name</label>
                        <input value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} type="text" placeholder="Doe"/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="text" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label>Invited by:</label>
                        <input value={formData.invited_by} onChange={(e) => setFormData({...formData, invited_by: e.target.value})} type="text" placeholder="mosaic"/>
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