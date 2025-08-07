import { Link, useNavigate } from "react-router-dom";
import "../../css/page_css/user_css/setting.css";
import { useState } from "react";
import Fail from "../../components/alert/fail";
import { changePassword, deleteUser } from "../../controllers/user";
import Success from "../../components/alert/success";

type FormDataType = {
    old_pwd: string,
    new_pwd: string,
    confirmed_pwd: string
}

const Setting = () => {
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");

    const [ action, setAction] = useState<boolean | null>(null);
    const [command, setCommand] = useState<string | null>(null);

    // hide and reveal password

    const [revealPwdStatus, setRevealPwdStatus] = useState<boolean>(true);
    const [revealPwdStatus2, setRevealPwdStatus2] = useState<boolean>(true);
    const [revealPwdStatus3, setRevealPwdStatus3] = useState<boolean>(true);

    const hideRevealPassword = (clickID: number) => {
        if(clickID == 1) return setRevealPwdStatus(! revealPwdStatus);
        if(clickID == 2) return setRevealPwdStatus2(! revealPwdStatus2);
        if(clickID == 3) return setRevealPwdStatus3(! revealPwdStatus3);
    }

    const handleHidden = (value: string) => {
        setCommand(value);
        setAction(prev => !prev);
    }

    const navigate = useNavigate();

    const handleDelete = async () => {
        setError("");
        setPerfect("");

        try{
            const {message} = await deleteUser();
            localStorage.clear();
            const storedTheme = localStorage.getItem("theme") || "light";
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
            localStorage.setItem("user_delete", message);
            navigate('/register');
        } catch(err){
            setError((err as Error).message);

        } finally{
            setTimeout(() => {
                setError("");
                setPerfect("");
            }, 8 * 1000);
            
            setTimeout(() => {
                setAction(null);
            }, 15 * 10000);
        }
    }

    const [formData, setFormData] = useState<FormDataType>({
        old_pwd: "",
        new_pwd: "",
        confirmed_pwd: ""
    });

    const handleChangePwd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPerfect("");

        try{
            const {message} = await changePassword(formData);
            setPerfect(message);
            setAction(null);
            
            setFormData({
                old_pwd: "",
                new_pwd: "",
                confirmed_pwd: ""
            })
        
        } catch(err){
            setError((err as Error).message);

        } finally{
            setTimeout(() => {
                setError("");
                setPerfect("");
            }, 8 * 1000);
        }
    }

    return ( 
        <div className={!action ? "setting" : "setting setting-inactive"}>
        {perfect && <Success success={`${perfect}`} />}
        {error && <Fail error={error} loggedinStatus={true} />}
            {   ! action &&  
                <>
                    <div className="setting-item">
                        <label>update</label>
                        <div className="setting-option">
                            <Link to={'/referral'}>
                                <span>
                                    <p>referral</p>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </span>
                            </Link>
                            <Link to={'/history'}>
                                <span>
                                    <p>notification</p>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="setting-item">
                        <label>security</label>
                        <div className="setting-option">
                            <span onClick={() => handleHidden("change-pwd")}>
                                <p>change password</p>
                                <i className="fa-solid fa-chevron-right"></i>
                            </span>
                            <span>
                                <p>contact support</p>
                                <i className="fa-solid fa-chevron-right"></i>
                            </span>
                        </div>
                    </div>
                    <div className="setting-item">
                        <label>account</label>
                        <div className="setting-option">
                            <Link to={'/update-profile'}>
                                <span>
                                    <p>change detail</p>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="setting-item">
                        <label>danger zone</label>
                        <div className="setting-option">
                            <span onClick={() => handleHidden("delete-user")}>
                                <p>delete account</p>
                                <i className="fa-solid fa-chevron-right"></i>
                            </span>
                        </div>
                    </div>
                </> 
            }
            {
                action &&
                <>
                    {
                        command === "delete-user" &&
                        <div className="setting-action">
                            <h4>Do you want to delete your account?</h4>
                            <span>
                                <p onClick={() => handleDelete} className="yes-delete">yes</p> 
                                <p onClick={() => {setAction(null); setCommand(null)}}>no</p>
                            </span>
                        </div>
                    }
                    {
                        command === "change-pwd" &&
                        <form onSubmit={handleChangePwd} className="setting-action sa-2">
                            <h4>Change Password</h4>
                            <div className="cpwd-body">
                                <div>
                                    <label>Old Password:</label>
                                    <input value={formData.old_pwd} onChange={(e) => setFormData({...formData, old_pwd: e.target.value})} type={revealPwdStatus ? "password" : "text"} placeholder="********" />
                                    <i onClick={() => hideRevealPassword(1)} className={revealPwdStatus ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                </div>
                                <div>
                                    <label>New Password:</label>
                                    <input value={formData.new_pwd} onChange={(e) => setFormData({...formData, new_pwd: e.target.value})} type={revealPwdStatus2 ? "password" : "text"} placeholder="********" />
                                    <i onClick={() => hideRevealPassword(2)} className={revealPwdStatus2 ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                </div>
                                <div>
                                    <label>Confirm New Password:</label>
                                    <input value={formData.confirmed_pwd} onChange={(e) => setFormData({...formData, confirmed_pwd: e.target.value})} type={revealPwdStatus3 ? "password" : "text"} placeholder="********" />
                                    <i onClick={() => hideRevealPassword(3)} className={revealPwdStatus3 ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                                </div>
                            </div>
                            <span className="cpwd-button">
                                <p onClick={() => {setAction(null); setCommand(null)}}>Go back</p>
                                <p><button type="submit">Change</button></p>
                            </span>
                        </form>
                    }
                </>
            }
        </div>
     );
}
 
export default Setting;