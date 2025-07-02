import bcrypt from "bcrypt";

const PasswordHash = async (password : string): Promise<string> => {
    const saltNum = await bcrypt.genSalt(10);
    return bcrypt.hash("" + password, saltNum);
}

export {PasswordHash}