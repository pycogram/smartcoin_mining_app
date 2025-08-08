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

    const {id, first_name, email} = data;
    
    if(data.first_name && data.email){
        localStorage.setItem("user", JSON.stringify({id, first_name, email}));
    }

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}
// update user
const updateUser = async (formData: object) => {

    const res = await fetch('/api/user/update', {
        method: 'PATCH', 
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
// delete user
const deleteUser = async () => {

    const res = await fetch('/api/user/delete', {
        method: 'DELETE', 
    });

    const data = await res.json();

    if(! res.ok){
        throw new Error(`${data.message}`);
    }

    return data;
}
// update password
const changePassword = async (formData: object) => {

    const res = await fetch('/api/user/change-password', {
        method: 'PATCH', 
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
// forgot password
const forgotPassword = async (formData: object) => {

    const res = await fetch('/api/user/forgot-password', {
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
// new password
const newPassword = async (formData: object) => {

    const res = await fetch('/api/user/new-password', {
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

export { 
    registerUser , verifyUser, confirmUser, loginUser,
    updateUser, deleteUser, changePassword, forgotPassword, newPassword
};  