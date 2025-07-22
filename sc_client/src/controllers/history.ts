export const historyUser = async (page: any, limit: number) => {

    const res = await fetch(`/api/history?skip=${page * limit}&limit=${limit}`, {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}