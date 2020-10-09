const nacl = require('libsodium-wrappers')

module.exports = (key)=> {
    if (typeof key === 'undefined') {
        throw "no key"
      }
    return Object.freeze({
        decrypt: (ciphertext, nonce) => {
         return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key);
        }
    })

}
