export const historyUser = async () => {
    //?skip=${page * limit}&limit=${limit}
    
    const res = await fetch(`/api/history`, {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}