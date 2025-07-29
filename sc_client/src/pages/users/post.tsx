import "../../css/page_css/user_css/post.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "../../components/button/primary-btn";
import { createPost } from "../../controllers/post";
import Fail from "../../components/alert/fail";


const CreatePost = () => {
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
        try{
            // to prevent page from reloading
            e.preventDefault();
            setError("");
            
            const {message} = await createPost(content);
            localStorage.setItem("message_user", message);
            navigate('/all-post');

        } catch(err){
            let message =  (err as Error).message;
            setError(message);
            console.log(345);

        } finally{
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }
    }
    return ( 
        <div className="page-box">
            {error && <Fail error={error} loggedinStatus={true} />}
            <div className="post-feed">
                <form onSubmit={handlePost} className="post-form" action="">
                    <Link to={'/all-post'}>
                        <span className="ref-span-go-back">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>
                    </Link>
                    <textarea rows={2} cols={10} value={content} onChange={(e) => setContent(e.target.value)} 
                        placeholder="Create a post">
                    </textarea>
                    <div className="post-btn">
                        <PrimaryBtn btnText={"Create Post"} />
                    </div>
                </form>
            </div>
        </div>
     );
}

export default CreatePost;