const nacl = require('libsodium-wrappers')

module.exports = async (key)=> {
    await nacl.ready;

    if (!key)  throw "no key argument passed";

    return Object.freeze({
        decrypt: (ciphertext, nonce) => {
        if(!ciphertext || !nonce) throw "missing arguments (ciphertext or nonce)";

         return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key);
        }
    })

}
