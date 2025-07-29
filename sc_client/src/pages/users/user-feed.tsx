import { Link } from "react-router-dom";
import Fail from "../../components/alert/fail";
import Success from "../../components/alert/success";
import { postViewDetail } from "../../controllers/post";
import "../../css/page_css/user_css/feed-pg.css";
import "../../css/page_css/user_css/user-feed.css";
import user_pic from "../../images/pics/pdp.png";
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react";
import { createComment } from "../../controllers/comment";
import { likePost, unlikePost } from "../../controllers/like";

type userType = {
    first_name: string,
    last_name: string,
    user_name: string,
}
type commentType = {
    _id: string,
    createdAt: string
    user: userType,
    content: string,
}
type postAllType = {
    _id: string,
    createdAt: string
    user: userType,
    content: string,
    commentCount: number,
    likeCount: number,
    comments: commentType[],
    likedByUser: boolean
}

const UserFeed = () => {
    const [content, setContent] = useState<string>("");
    const post_id = localStorage.getItem("post_id") ?? "";
    const [postDetail, setPostDetail] = useState<postAllType | null>(null);
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(true);

    const fetchPostDetail = async () => {
        if(!post_id) return;

        try{
            const {data} = await postViewDetail(post_id);
            setPostDetail(data);
            setIsReady(false);
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
            }, 10 * 1000);
        }

    }

    useEffect(() => {
        fetchPostDetail();
    }, []);

    const handleLike = async(post_id: string, likeStatus: boolean) => {
        try{
            let message = "";
            if (! likeStatus) {
                ({ message } = await likePost(post_id));
            } else {
                ({ message } = await unlikePost(post_id));
            }
            setPerfect(message);
            fetchPostDetail();
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
            }, 5 * 1000);
        }
    }
 
    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        try{
            // to prevent page from reloading
            e.preventDefault();
            setError("");
            setPerfect("");
            
            const comment = content;
            const {message} = await createComment(post_id, comment);
            fetchPostDetail();
            setPerfect(message);
            setContent("");

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

    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

    return ( 
        <div className="page-box">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}

        {   
            postDetail &&
                <div className="feed-pg user-feed">
                    <Link to={'/all-post'}>
                        <span className="ref-span-go-back">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>
                    </Link>
                    <div className="feed-container">
                        <div className="feed-img-uname-timr-lv">
                            <div className="img-uname-time">
                                <span className="span-img">
                                    <img src={user_pic} alt="user pic" />
                                </span>
                                <span className="span-hp">
                                    <h4>{postDetail.user.first_name} {postDetail.user.last_name}</h4>
                                    <p>@{postDetail.user.user_name}</p>
                                </span>
                            </div>
                            <div className="lv">
                                <p>lv 12</p>
                            </div>
                        </div>
                        <div className="feed-hpp">
                            <h5>
                                {postDetail.content}
                            </h5>
                            <p>{formatDistanceToNow(new Date(postDetail.createdAt), {addSuffix: true}).replace(/^about/, "")}</p>
                        </div>
                    </div>
                    <div className="feed-impression">
                        <span onClick={() => handleLike(postDetail._id, postDetail.likedByUser)}>
                            {
                                ! postDetail.likedByUser ? 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                                    <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                </svg>
                            }
                            <p>{postDetail.likeCount}</p>
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                            </svg>
                            <p>{postDetail.commentCount}</p>
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </span>
                    </div>
                    <div className="feed-replies">
                        <h4>{postDetail.comments.length > 0 ? "Replies" : "No reply yet"}</h4>
                        {   postDetail.comments.map(comment => 
                             <div key={comment._id} className="feed-each-item">
                                <div className="feed-img">
                                    <span>
                                        <img src={user_pic} alt="user pic" />
                                    </span>
                                </div>
                                <div className="feed-body">
                                    <div className="feed-name-cont-time">
                                        <span>
                                            <h4>{comment.user.first_name} {comment.user.last_name} @{comment.user.user_name}</h4>
                                            <span>
                                                <p>lv 12</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </span>
                                        </span>
                                        <h5>
                                            {comment.content}
                                        </h5>
                                        <span>
                                            <p>{formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true}).replace(/^about/, "")}</p>
                                        </span>
                                    </div>
                                </div>
                            </div> )
                        }
                    </div>
                    <form onSubmit={handleComment} className="feed-form" action="">
                        <textarea rows={2} cols={10} value={content} onChange={(e) => setContent(e.target.value)} 
                            placeholder="Reply">
                        </textarea>
                        <button type="submit">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            }
        </div>
     );
}
 
export default UserFeed;