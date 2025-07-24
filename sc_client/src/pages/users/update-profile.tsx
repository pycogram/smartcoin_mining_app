import PrimaryBtn from "../../components/button/primary-btn";
import pdp from "../../images/pics/pdp.png";
import "../../css/page_css/user_css/register-pg.css";
import "../../css/page_css/user_css/update-profile.css";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/user";
import Fail from "../../components/alert/fail";
import { updateUser } from "../../controllers/user";
import { Link, useNavigate } from "react-router-dom";
import Success from "../../components/alert/success";

type UserDataType  = {
    first_name: string,
    last_name: string,
    user_name: string
}

const UpdateProfile = () => {

    const {user} = useContext(UserContext)!;
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");

    const { setUser } = useContext(UserContext)!;

    if(! user) {
        setError(`user data not avaialble at the moment`);
        return;
    };

    const [userData, setUserData] = useState<UserDataType>({
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
    });

    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPerfect("")

        try{
            const {message, data} = await updateUser(userData);
            setPerfect(message);
            setUser(data);
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1 * 1000);

        } catch(err){
            let message =  (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setError("");
                setPerfect("");
            }, 10 * 1000);
        }
    }

    return ( 
        <div className="register-page login-page update-profile-container">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}
            <form onSubmit={handleUpdate} className="update-profile">
                <span className="ref-span-go-back">
                    <Link to={'/dashboard'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Link>
                </span>
                
                <div className="form-input-box login-form2">
                    <div className="update-img">
                        <img  src={pdp} alt="profile pic" />                  
                        <i className="fa-solid fa-plus update-i"></i>
                   </div>
                    <div>
                        <label>First name:</label>
                        <input value={userData.first_name} onChange={(e) => setUserData({...userData, first_name: e.target.value})} type="text" placeholder="John"/>
                    </div>
                    <div>
                        <label>Last name</label>
                        <input value={userData.last_name} onChange={(e) => setUserData({...userData, last_name: e.target.value})} type="text" placeholder="Doe"/>
                    </div>
                    <div>
                        <label>Username</label>
                        <input value={userData.user_name} onChange={(e) => setUserData({...userData, user_name: e.target.value})} type="text" placeholder="johnnythedeo"/>
                    </div>
                </div>
                <div className="form-btn">
                    <PrimaryBtn btnText={"update"} />
                </div>
            </form>
        </div>
    );
}
 
export default UpdateProfile;