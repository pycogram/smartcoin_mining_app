import '../../css/page_css/user_css/register-pg.css';
import Success from "../../components/alert/success";
import Fail from "../../components/alert/fail";
import PrimaryBtn from '../../components/button/primary-btn';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FormDataType = {
    email: string,
    password?: string
}

const ForgetPwdPage = () => {

    const [formData, setFormData] = useState<FormDataType>({
        email: "",
        password: "",
    });

    //error state
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");

    const navigate = useNavigate();
    const handleForgetPwd = async () => {
        setError("");
        setPerfect("");
    }

    const handleGoBack = () => {
        navigate('/login')
    }

    return ( 
        <div className="register-page login-page">
            <form onSubmit={handleForgetPwd}>
                {perfect && <Success success={`${perfect}`} />}
                {error && <Fail error={error} />}
                <header className="header-text">Reset Password</header>
                <div className="form-input-box login-form2">
                    <div>
                        <label>Email:</label>
                        <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="text" placeholder="johndoe@gmail.com"/>
                    </div>
                    <p onClick={handleGoBack} className="forgetPwd">go back</p>
                </div>
                <div className="form-btn">
                    <PrimaryBtn btnText={"reset password"} />
                </div>
            </form>
        </div>
    );
}
 
export default ForgetPwdPage;