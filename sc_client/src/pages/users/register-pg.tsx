import { Link } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import "../../css/page_css/user_css/register-pg.css";

const RegisterPage = () => {
    return ( 
        <div className="register-page">
            <form action="">
                <header className="header-text">Register</header>
                <div className="form-input-box">
                    <div>
                        <label>First name:</label>
                        <input type="text" placeholder="John"/>
                    </div>
                    <div>
                        <label>Last name</label>
                        <input type="text" placeholder="Doe"/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="text" placeholder="johndoe@gmail.com"/>
                    </div>
                    <div>
                        <label>Invited by:</label>
                        <input type="text" placeholder="mosaic"/>
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="text" placeholder="*******"/>
                        <i className="fa-solid fa-eye-slash"></i>
                    </div>
                    <div>
                        <label>Confirm password:</label>
                        <input type="text" placeholder="*******"/>
                        <i className="fa-solid fa-eye-slash"></i>
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
                    <p>already have an account? Pls <Link to={""} className="login-option">login</Link></p>
                </div>
            </form>
        </div>
    );
}
 
export default RegisterPage;