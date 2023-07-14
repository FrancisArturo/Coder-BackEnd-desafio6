import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {  
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

