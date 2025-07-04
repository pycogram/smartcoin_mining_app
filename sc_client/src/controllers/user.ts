// register user
const registerUser = async (formData: object) => {

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
const verifyUser = async (email: string) => {
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
// confirm user
const confirmUser = async (code: string, id: string) => {
    const res = await fetch("api/user/confirm", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code, id})
    });
    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}
// login user
const loginUser = async (formData: object) => {

    const res = await fetch('/api/user/login', {
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

export { registerUser , verifyUser, confirmUser, loginUser};  