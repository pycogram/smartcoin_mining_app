export const walletId = async () => {
    const res = await fetch('/api/wallet/receive-sc', {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}
export const confirmUserWallet = async (wallet_id: string) => {
    const res = await fetch('/api/wallet/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({wallet_id})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}
export const sendSc = async (wallet_id: string, amount_sc: number) => {
    const res = await fetch('/api/wallet/send-sc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({wallet_id, amount_sc})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}