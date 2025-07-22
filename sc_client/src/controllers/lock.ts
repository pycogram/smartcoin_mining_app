export const lockSc = async (lock_sc: number, lock_period: number) => {
    const res = await fetch('/api/package/lock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({lock_sc, lock_period})
    });

    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}

export const unLockSc = async (unlock_sc: boolean) => {
    const res = await fetch('/api/package/unlock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({unlock_sc})
    });

    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}

