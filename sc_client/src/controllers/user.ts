//register user

const registerUser = async (formData : object) => {

    const res = await fetch('/api/user/register', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formData})
    });

    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}

// verify user
const verifyUser = async (email : string) => {
    const res = await fetch("api/user/verify", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}

export { registerUser , verifyUser};