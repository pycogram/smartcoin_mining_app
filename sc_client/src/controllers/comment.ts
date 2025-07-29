export const createComment = async (post_id: string, comment: string) => {
    const res = await fetch('/api/comment/create-comment', {
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