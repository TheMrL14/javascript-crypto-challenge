module.exports = () => {
    return Object.freeze({
        verifyingKey: () => {
            let pk,sk
            nacl.crypto_sign_keypair(pk,sk)
            return pk;
           }
    })
}