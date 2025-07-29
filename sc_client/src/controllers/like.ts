export const likePost = async (post_id: string) => {
    const res = await fetch('/api/like/create-like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({post_id})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}

export const unlikePost = async (post_id: string) => {
    const res = await fetch('/api/like/un-like', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({post_id})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}