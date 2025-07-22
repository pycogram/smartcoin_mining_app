export const mineDetail = async () => {

    const res = await fetch('/api/dashboard/', {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}

export const mineSc = async (mine_sc: boolean) => {
    const res = await fetch('/api/dashboard/mine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mine_sc})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}