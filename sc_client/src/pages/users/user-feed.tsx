import "../../css/page_css/user_css/feed-pg.css";
import "../../css/page_css/user_css/user-feed.css";
import user_pic from "../../images/pics/pdp.png";
import { useState } from "react";

const UserFeed = () => {
    const [reply, setReply] = useState<string>("");

    return ( 
        <div className="page-box">
            <div className="feed-pg user-feed">
                <span className="ref-span-go-back">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </span>
                <div className="feed-container">
                    <div className="feed-img-uname-timr-lv">
                        <div className="img-uname-time">
                            <span className="span-img">
                                <img src={user_pic} alt="user pic" />
                            </span>
                            <span className="span-hp">
                                <h4>ifesinach daniel</h4>
                                <p>@pikoo</p>
                            </span>
                        </div>
                        <div className="lv">
                            <p>lv 12</p>
                        </div>
                    </div>
                    <div className="feed-hpp">
                        <h5>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga commodi ducimus earum, voluptate vitae velit consectetur, porro veniam facilis nemo totam expedita eos quidem, suscipit rerum ullam eligendi voluptates? In ipsam nam dolore ratione veniam consectetur, iste aspernatur aliquid temporibus maxime quam autem libero, reprehenderit voluptatem totam tenetur atque incidunt!
                        </h5>
                        <p>sun, 24th, 2025</p>
                    </div>
                </div>
                <div className="feed-impression">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <p>1k</p>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                        <p>80</p>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                        <p>17</p>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        <p>6</p>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </span>
                </div>
                <div className="feed-replies">
                    <h4>replies</h4>
                    <div className="feed-each-item">
                        <div className="feed-img">
                            <span>
                                <img src={user_pic} alt="user pic" />
                            </span>
                        </div>
                        <div className="feed-body">
                            <div className="feed-name-cont-time">
                                <span>
                                    <h4>@pikoo ~ ifesinach daniel</h4>
                                    <span>
                                        <p>lv 12</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </span>
                                </span>
                                <h5>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga commodi ducimus earum, voluptate vitae velit consectetur, porro veniam facilis nemo totam expedita eos quidem, suscipit rerum ullam eligendi voluptates? In ipsam nam dolore ratione veniam consectetur, iste aspernatur aliquid temporibus maxime quam autem libero, reprehenderit voluptatem totam tenetur atque incidunt!
                                </h5>
                                <span>
                                    <p>show all</p>
                                    <p>sun, 24th, 2025</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="feed-each-item">
                        <div className="feed-img">
                            <span>
                                <img src={user_pic} alt="user pic" />
                            </span>
                        </div>
                        <div className="feed-body">
                            <div className="feed-name-cont-time">
                                <span>
                                    <h4>@pikoo ~ ifesinach daniel</h4>
                                    <span>
                                        <p>lv 12</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </span>
                                </span>
                                <h5>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga commodi ducimus earum, voluptate vitae velit consectetur, porro veniam facilis nemo totam expedita eos quidem, suscipit rerum ullam eligendi voluptates? In ipsam nam dolore ratione veniam consectetur, iste aspernatur aliquid temporibus maxime quam autem libero, reprehenderit voluptatem totam tenetur atque incidunt!
                                </h5>
                                <span>
                                    <p>show all</p>
                                    <p>sun, 24th, 2025</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="feed-each-item">
                        <div className="feed-img">
                            <span>
                                <img src={user_pic} alt="user pic" />
                            </span>
                        </div>
                        <div className="feed-body">
                            <div className="feed-name-cont-time">
                                <span>
                                    <h4>@pikoo ~ ifesinach daniel</h4>
                                    <span>
                                        <p>lv 12</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </span>
                                </span>
                                <h5>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga commodi ducimus earum, voluptate vitae velit consectetur, porro veniam facilis nemo totam expedita eos quidem, suscipit rerum ullam eligendi voluptates? In ipsam nam dolore ratione veniam consectetur, iste aspernatur aliquid temporibus maxime quam autem libero, reprehenderit voluptatem totam tenetur atque incidunt!
                                </h5>
                                <span>
                                    <p>show all</p>
                                    <p>sun, 24th, 2025</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="feed-each-item">
                        <div className="feed-img">
                            <span>
                                <img src={user_pic} alt="user pic" />
                            </span>
                        </div>
                        <div className="feed-body">
                            <div className="feed-name-cont-time">
                                <span>
                                    <h4>@pikoo ~ ifesinach daniel</h4>
                                    <span>
                                        <p>lv 12</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </span>
                                </span>
                                <h5>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga commodi ducimus earum, voluptate vitae velit consectetur, porro veniam facilis nemo totam expedita eos quidem, suscipit rerum ullam eligendi voluptates? In ipsam nam dolore ratione veniam consectetur, iste aspernatur aliquid temporibus maxime quam autem libero, reprehenderit voluptatem totam tenetur atque incidunt!
                                </h5>
                                <span>
                                    <p>show all</p>
                                    <p>sun, 24th, 2025</p>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="feed-form" action="">

                    <textarea rows={2} cols={10} value={reply} onChange={(e) => setReply(e.target.value)} 
                            placeholder="Reply" required>
                        </textarea>

                        <button type="submit">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    
                </form>
            </div>
        </div>
     );
}
 
export default UserFeed;