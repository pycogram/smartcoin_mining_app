export const postViewAll = async () => {
    const res = await fetch('/api/post/view-all', {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}

export const postViewDetail = async (post_id: string) => {
    const res = await fetch('/api/post/view-detail', {
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

export const createPost = async (content: string) => {
    const res = await fetch('/api/post/create-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({content})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}