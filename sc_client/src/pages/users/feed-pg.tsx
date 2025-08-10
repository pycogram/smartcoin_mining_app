import { useEffect, useState, useRef } from "react";
import "../../css/page_css/user_css/feed-pg.css";
import user_pic from "../../images/pics/pdp.png";
import { deletePost, postViewAll } from "../../controllers/post";
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom";
import Fail from "../../components/alert/fail";
import Success from "../../components/alert/success";
import { likePost, unlikePost } from "../../controllers/like";

type userType = {
    _id: string
    first_name: string,
    last_name: string,
    user_name: string,
    pdp_url: string
}
type postAllType = {
    _id: string,
    createdAt: string,
    updatedAt: string,
    user: userType,
    content: string,
    commentCount: number,
    likeCount: number,
    likedByUser: boolean,
    allLevel: number
}

const FeedPage = () => {
    const [postAll, setPostAll] = useState<postAllType[]>([]);
    const [overflowMap, setOverflowMap] = useState<Record<string, boolean>>({});
    const contentRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
    const [isReady, setIsReady] = useState<boolean>(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [perfect, setPerfect] = useState<string>("");
    const messageUser = localStorage.getItem("message_user") ?? "";
    const userId = localStorage.getItem("user_id");

    const fetchPost = async () => {

        try{
            const {data} = await postViewAll();
            setPostAll(data);
            localStorage.removeItem("post_id");
            setIsReady(false);
            setPerfect(messageUser);
            
        } catch(err){
            let message = (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setPerfect("");
                setError("");
                localStorage.removeItem("message_user");
            }, 5 * 1000);
        }
    }
    useEffect(()=> {
        fetchPost();
    }, []);

    useEffect(() => {
        const newMap: Record<string, boolean> = {};
        postAll.forEach((post) => {
            const element = contentRefs.current[post._id];
            if(element){
                const style  = getComputedStyle(element);
                const lineHeight = parseFloat(style.lineHeight);
                const maxHeight = lineHeight * 4
                if(element.scrollHeight > maxHeight){
                    newMap[post._id] = true;
                } else {
                    newMap[post._id] = false;
                }
            }
        });
        setOverflowMap(newMap);
    }, [postAll]);

    const handleViewPost = (post_id: string) => {
        localStorage.setItem('post_id', post_id);
        navigate('/post-view');
    }

    const handleCreatePost = () => {
        navigate('/create-post');
    }

    const handleLike = async(post_id: string, likeStatus: boolean) => {
        try{
            let message = "";
            if (! likeStatus) {
                ({ message } = await likePost(post_id));
            } else {
                ({ message } = await unlikePost(post_id));
            }
            setPerfect(message);
            fetchPost();
            
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

    const handleDelete = async (postId: string) => {
        try{
            const {message} = await deletePost(postId);
            setPerfect(message);
            fetchPost();

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
    
    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

    return ( 
        <div className="feed-pg bg-primary">
            {error && <Fail error={error} loggedinStatus={true} />}
            {perfect && <Success success={`${perfect}`} loggedinStatus={true} />}

            {
                postAll.map((post) => 
                    <div key={post?._id} className="feed-each-item">
                        <div className="feed-img">
                            <span>
                                <img src={post.user?.pdp_url ?? user_pic} alt="user pic" />
                            </span>
                        </div>
                        <div className="feed-body">
                        
                            <div onClick={() => handleViewPost(post?._id)} className="feed-name-cont-time">
                                <span>
                                    <h4>{post.user?.first_name} {post.user?.last_name}  @{post.user?.user_name}</h4>
                                    <p>lv {post?.allLevel != 0 ? (1 + Math.floor((post?.allLevel) / 100)) : 0}</p>
                                </span>
                                <h5 
                                    ref={(el) => {contentRefs.current[post?._id] = el}} 
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                > 
                                    {post.user?.pdp_url} {post?.content}
                                </h5>
                                <span>
                                    {overflowMap[post?._id] && ( <p className="fnct-p1" onClick={() => handleViewPost(post?._id)} >show all</p>)}
                                    <p className="fnct-p2"> {post?.createdAt !== post?.updatedAt ? "edited ~ " : "" } {formatDistanceToNow(new Date(post?.createdAt), {addSuffix: true}).replace(/^about/, '')}</p>
                                </span>
                            </div>

                            <div className="feed-impression">
                                <span onClick={() => handleLike(post?._id, post?.likedByUser)}>
                                    {
                                        ! post?.likedByUser ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                        </svg>
                                    }
                                    <p>{post?.likeCount}</p>
                                </span>
                                <span onClick={() => handleViewPost(post?._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                    </svg>
                                    <p>{ post?.commentCount }</p>
                                </span>
                                <span onClick={() => sidePostOption(post?._id)}>
                                {
                                    clickOption === post?._id ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                }
                                </span>
                                {    
                                    clickOption === post?._id &&
                                    <div className="sidePostEDR">
                                        <ul>
                                            {
                                                userId === post.user?._id ?
                                                <>
                                                    <li onClick={() => handleEdit(post?._id, post?.content)}>edit post</li>
                                                    <li onClick={() => handleDelete(post?._id)}>delete post</li> 
                                                </> :
                                                <>
                                                    <li onClick={() => setClickOption(null)}>report post</li> 
                                                </>
                                            }
                                        </ul>  
                                    </div> 
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            <span onClick={handleCreatePost} className="feed-post-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </span>
        </div>
    );
}
 
export default FeedPage;
