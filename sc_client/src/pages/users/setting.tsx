import { Link } from "react-router-dom";
import "../../css/page_css/user_css/setting.css";

const Setting = () => {
    return ( 
        <div className="setting">
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
                    <span>
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
                    <span>
                        <p>delete account</p>
                        <i className="fa-solid fa-chevron-right"></i>
                    </span>
                </div>
            </div>
        </div>
     );
}
 
export default Setting;