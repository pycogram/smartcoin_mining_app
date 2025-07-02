import crypto from 'crypto';

const HmacProcess = (value: string, key: string): string => {
    return(crypto.createHmac('sha256', key).update(value).digest('hex'));
}

export default HmacProcess;
