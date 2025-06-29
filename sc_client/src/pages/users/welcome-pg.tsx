import PrimaryBtn from '../../components/button/primary-btn';
import { Link } from "react-router-dom";
import logo from '../../images/logos/sc_logo.png';
import mining_pic from '../../images/pics/miningscpic.png';
import "../../css/page_css/user_css/welcome-pg.css";

const WelcomePage = () => {
    return ( 
        <div className="welcomepage">
            <div className='w-box'>
                <div className="img-text">
                    <span className='img-box'>
                        <img src={logo} alt="img logo" />
                    </span>
                    <span className='text-body'>
                        <h2>Welcome</h2>
                        <h3>
                            Smartcoin Network (SCN) is a fun, free mobile mining app 
                            where you collect "smartcoin" daily, no real-world value, 
                            no-shit, just pure digital fun. No setup, no cost, no stress. 
                            Tap to mine, build your stash, and join a growing community of curious minds.
                        </h3>
                    </span>
                </div>
                <div className='btn'> 
                    <Link to={"/register"}>
                        <PrimaryBtn btnText={"Get Started"} />
                    </Link>
                </div>
                <div className='mining-pic'>
                    <img src={mining_pic} alt="mining logo" className="" />
                </div>
            </div>
        </div>
     );
}
 
export default WelcomePage;