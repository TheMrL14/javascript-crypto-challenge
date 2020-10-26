const nacl = require('libsodium-wrappers')

module.exports = async (key) => {
    await nacl.ready;
    if (!key)  throw "no key argument passed";

    return Object.freeze({
        encrypt: (msg) => {
            if (!msg) throw "missing argument (msg)";
            
            const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
            const ciphertext = nacl.crypto_secretbox_easy(msg, nonce, key);

            return {
                nonce: nonce,
                ciphertext: ciphertext
            };
        }
    })

}