export const referralDetail = async () => {
    const res = await fetch('/api/referral/', {
        method: 'GET'
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}

export const claimRefBonus = async (claim_sc: boolean) => {
    const res = await fetch('/api/referral/claim-bonus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({claim_sc})
    });
    const data = await res.json();
    if(! res.ok){
        throw new Error(`${data.message}`);
    }
    return data;
}