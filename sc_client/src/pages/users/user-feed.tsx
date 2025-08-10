import { Link, useNavigate } from "react-router-dom";
import Fail from "../../components/alert/fail";
import Success from "../../components/alert/success";
import { deletePost, postViewDetail } from "../../controllers/post";
import "../../css/page_css/user_css/feed-pg.css";
import "../../css/page_css/user_css/user-feed.css";
import user_pic from "../../images/pics/pdp.png";
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react";
import { createComment, deleteComment, updateComment } from "../../controllers/comment";
import { likePost, unlikePost } from "../../controllers/like";

type userType = {
    _id: string
    first_name: string,
    last_name: string,
    user_name: string,
    pdp_url: string
}
type commentType = {
    _id: string,
    createdAt: string,
    updatedAt: string,
    user: userType,
    content: string,
}
type postAllType = {
    _id: string,
    createdAt: string,
    updatedAt: string,
    user: userType,
    content: string,
    commentCount: number,
    likeCount: number,
    comments: commentType[],
    likedByUser: boolean,
    level: number
}

const UserFeed = () => {
    const [content, setContent] = useState<string>("");
    const post_id = localStorage.getItem("post_id") ?? "";
    const [postDetail, setPostDetail] = useState<postAllType | null>(null);
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(true);
    const userId = localStorage.getItem("user_id");

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

    const [clickOption, setClickOption] = useState<string | null>(null);

    const sidePostOption = (postId: string) => {
        setClickOption(prev => (prev === postId ? null : postId));
    };

    const handleEdit = (postId: string, postContent: string) => {
        navigate('/create-post', {state: {postId, postContent}})
    }

    const navigate = useNavigate();
    const handleDelete = async (postId: string) => {
        try{
            const {message} = await deletePost(postId);
            setPerfect(message);
            navigate('/all-post')

        } catch(err){
            let message = (err as Error).message;
            setError(message);

        }finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
                setClickOption(null);
            }, 8 * 1000);
        }
    }
 
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        try{
            // to prevent page from reloading
            e.preventDefault();
            setError("");
            setPerfect("");
            
            const comment = content;
            const commentId = editCommentId!;
            let message = "";

            if(editCommentId && editCommentId.length === 24){
                ({message} = await updateComment(commentId, comment));
                setEditCommentId(null);
            } else {
                ({message} = await createComment(post_id, comment));
            }

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

    const [clickOptionCom, setClickOptionCom] = useState<string | null>(null);

    const sideComOption = (commentId: string) => {
        setClickOptionCom(prev => (prev === commentId ? null : commentId));
    };

    const handleEditCom = (postId: string, postContent: string) => {
        setEditCommentId(postId);
        setContent(postContent);
    }

    const handleDeleteCom = async (commentId: string) => {
        try{
            const {message} = await deleteComment(commentId);
            setPerfect(message);
            fetchPostDetail();

        } catch(err){
            let message = (err as Error).message;
            setError(message);

        }finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
                setClickOptionCom(null);
            }, 8 * 1000);
        }
    }

    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

    return ( 
        <div className="page-box3">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}

        {   
            postDetail &&
                <div className="feed-pg user-feed">
                    <div className="uf-box">
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
                                        <img src={postDetail.user?.pdp_url ?? user_pic} alt="user pic" />
                                    </span>
                                    <span className="span-hp">
                                        <h4>{postDetail.user?.first_name} {postDetail.user?.last_name}</h4>
                                        <p>@{postDetail.user?.user_name}</p>
                                    </span>
                                </div>
                                <div className="lv">
                                    <p>lv {postDetail?.level != 0 ? (1 + Math.floor((postDetail?.level) / 100)) : 0}</p>
                                </div>
                            </div>
                            <div className="feed-hpp">
                                <h5>
                                    {postDetail?.content}
                                </h5>
                                <p> {postDetail?.createdAt !== postDetail?.updatedAt ? "edited ~ " : ""} {formatDistanceToNow(new Date(postDetail?.createdAt), {addSuffix: true}).replace(/^about/, "")}</p>
                            </div>
                        </div>
                        <div className="feed-impression">
                            <span onClick={() => handleLike(postDetail?._id, postDetail?.likedByUser)}>
                                {
                                    ! postDetail?.likedByUser ? 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                                        <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                    </svg>
                                }
                                <p>{postDetail?.likeCount}</p>
                            </span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                <p>{postDetail?.commentCount}</p>
                            </span>
                            <span onClick={() => sidePostOption(postDetail?._id)}>
                                {
                                    clickOption === postDetail?._id ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                }
                            </span>
                            {    
                                clickOption === postDetail?._id &&
                                <div className="sidePostEDR sPEDR2">
                                    <ul>
                                        {
                                            userId === postDetail.user?._id ?
                                            <>
                                                <li onClick={() => handleEdit(postDetail?._id, postDetail?.content)}>edit post</li>
                                                <li onClick={() => handleDelete(postDetail?._id)}>delete post</li> 
                                            </> :
                                            <>
                                                <li onClick={() => setClickOption(null)}>report post</li> 
                                            </>
                                        }
                                    </ul>  
                                </div> 
                            }
                        </div>
                        <div className="feed-replies">
                            <h4>{postDetail?.comments.length > 0 ? "Replies" : "No reply yet"}</h4>
                            {   postDetail?.comments.map(comment => 
                                <div key={comment._id} className="feed-each-item">
                                    <div className="feed-img">
                                        <span>
                                            <img src={comment.user?.pdp_url ?? user_pic} alt="user pic" />
                                        </span>
                                    </div>
                                    <div className="feed-body">
                                        <div className="feed-name-cont-time">
                                            <span>
                                                <h4>{comment.user?.first_name} {comment.user?.last_name} @{comment.user?.user_name}</h4>
                                                <span>
                                                    <p className="fnct-plv">lv 12</p>
                                                    <span onClick={() => sideComOption(comment._id)}>
                                                        {
                                                            clickOptionCom === comment._id ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                            </svg> :
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                            </svg>
                                                        }
                                                        {    
                                                            clickOptionCom === comment._id &&
                                                            <div className="sidePostEDR2">
                                                                <ul>
                                                                    {
                                                                        userId === comment.user._id ?
                                                                        <>
                                                                            <li onClick={() => handleEditCom(comment._id, comment.content)}>edit comment</li>
                                                                            <li onClick={() => handleDeleteCom(comment._id)}>delete comment</li> 
                                                                        </> :
                                                                        <>
                                                                            <li onClick={(e) => {e.stopPropagation(); setClickOptionCom(null)}}>
                                                                                report comment
                                                                            </li>
                                                                        </>
                                                                    }
                                                                </ul>  
                                                            </div> 
                                                        }
                                                    </span>
                                                </span>
                                            </span>
                                            <h5>
                                                {comment.content}
                                            </h5>
                                            <span>
                                                <p> {comment.createdAt !== comment.updatedAt ? "edited ~ " : ""} {formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true}).replace(/^about/, "")}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div> 
                                )
                            }
                        </div>
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
