import CryptoJS from 'crypto-js'

export const hashToken = (token) => {
    //everytime same hashed value will be generated for the same token
    const hashed = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex)
    return hashed
}