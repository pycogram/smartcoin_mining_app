import PrimaryBtn from "../../components/button/primary-btn";
import pdp from "../../images/pics/pdp.png";
import "../../css/page_css/user_css/register-pg.css";
import "../../css/page_css/user_css/update-profile.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user";
import Fail from "../../components/alert/fail";
import { updateUser } from "../../controllers/user";
import { Link, useNavigate } from "react-router-dom";
import Success from "../../components/alert/success";

type UserDataType  = {
    first_name: string,
    last_name: string,
    user_name: string,
    email: string,
}

const UpdateProfile = () => {

    const {user} = useContext(UserContext)!;
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(user?.pdp_url || pdp);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const { setUser } = useContext(UserContext)!;

    if (!user) {
        return <Fail error="User data not available at the moment" loggedinStatus={true} />;
    }

    const [userData, setUserData] = useState<UserDataType>({
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email
    });

    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPerfect("")

        try{
            const formData = new FormData();
                formData.append("first_name", userData.first_name);
                formData.append("last_name", userData.last_name);
                formData.append("user_name", userData.user_name);
                formData.append("email", userData.email);

            if (file) formData.append("image", file); 

            const {message, data} = await updateUser(formData);
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
                <span className="ref-span-go-back2">
                    <Link to={'/dashboard'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Link>
                </span>
                
                <div className="form-input-box login-form2">
                    <div className="update-img">
                        <img src={preview} alt="profile pic" />                  
                        <i className="fa-solid fa-plus update-i"></i>
                        <input onChange={(e) => {
                                const selectedFile = e.target.files && e.target.files[0];
                                if (selectedFile) {
                                    setFile(selectedFile);
                                    setPreview(URL.createObjectURL(selectedFile));
                                }
                            }}  
                            type="file" accept="image/*" className="img-input" 
                        />
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
                    <div>
                        <label>Email</label>
                        <input className="email-input" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} type="text" placeholder="johnnythedeo" disabled/>
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
