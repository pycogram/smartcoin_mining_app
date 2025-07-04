import bcrypt from "bcrypt";

const PasswordHash = async (password: string): Promise<string> => {
    const saltNum = await bcrypt.genSalt(10);
    return bcrypt.hash("" + password, saltNum);
}

const PasswordVerify = async(password: string, hashedPassword: string): Promise<boolean> =>{
    return bcrypt.compare(password, hashedPassword)
}

export {PasswordHash, PasswordVerify}