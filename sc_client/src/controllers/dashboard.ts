// detail of user
export const detailUser = async () => {
    const res = await fetch('/api/user/', {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}

