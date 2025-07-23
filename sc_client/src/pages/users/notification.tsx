import { useEffect, useRef, useState } from "react";
import "../../css/page_css/user_css/notification.css";
import { historyUser } from "../../controllers/history";
import { format } from 'date-fns';
import { Link } from "react-router-dom";
import Fail from "../../components/alert/fail";
import LoadContent from "../../components/loader/load";

type HistoryType = {
    _id: string,
    detail: string,
    time: any
}

const NotificationPg = () => {
    const [history, setHistory] = useState<HistoryType[]>([]);
    const [isReady, setIsReady] = useState<boolean>(true);
    const [error, setError] =  useState<string>("");
    const [page, setPage] = useState<number>(1);
    const limit = 1;
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loader = useRef(null);

    const fetchHistory = async () => {
        if (!hasMore || loading) return;
        setLoading(true);

        try{
            const {data} = await historyUser(page, limit);
            setHistory((prev) => [...prev, ...data]);
            // check if there's more data to load

            setHistory((prev) => {
                const existingIds = new Set(prev.map(item => item._id));
                const filteredData = data.filter((item : any) => !existingIds.has(item._id));
                return [...prev, ...filteredData];
            });
            
            if (data.length < limit) {
                setHasMore(false);
            }
            setIsReady(false);

        } catch(err){
            let message =  (err as Error).message;
            setError(message);

        } finally{
            setTimeout(() => {
                setLoading(false);
            }, 3 * 1000);
            
            setTimeout(() => {
                setError("");
            }, 10 * 1000);
        }
    }
    useEffect(() => {
        fetchHistory();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];

            // prevent fetching if no more data
            if (target.isIntersecting && !loading && hasMore) {
                setPage((prevPage) => {
                    // prevent re-triggering same page
                    if (prevPage === page) return prevPage;
                    return prevPage + 1;
                });
            }
            
        },
        {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        }
    );
    if(loader.current) observer.observe(loader.current);
    return () => {
        if(loader.current) observer.unobserve(loader.current);
    }
    }, [loading, hasMore]);

    if(isReady) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

    return (
        <div className="page-box">
            <div className="notify-pg">
                <span className="ref-span-go-back">
                    <Link to={'/dashboard'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </Link>
                </span>
                {error && <Fail error={error} loggedinStatus={true} />}
                <h3>{history.length != 0 ? `Notification - ${history.length}` : "No history"}</h3>
                <div className="notify-detail">
                    {   history.map((value, index) => 
                        <span key={index}>
                           <div>
                                <h3 className="nd-h3">{index+1 + ". "}</h3>
                                <h4>{value.detail}.</h4>
                           </div>
                            <p>{format(value.time, "EEEE, MMMM do yyyy, h:mm:ss a")} </p>
                        </span>  
                    )}  
                    { loading && <LoadContent />} 
                    <div ref={loader}></div>
                </div>
            </div>
        </div> 
     );
}
 
export default NotificationPg;