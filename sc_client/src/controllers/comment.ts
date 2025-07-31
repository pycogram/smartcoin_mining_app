export const createComment = async (post_id: string, comment: string) => {
    const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({post_id, comment})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}
export const updateComment = async (commentId: string, comment: string) => {
    const res = await fetch('/api/comment/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({commentId, comment})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}
export const deleteComment = async (commentId: string) => {
    const res = await fetch('/api/comment/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({commentId})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}