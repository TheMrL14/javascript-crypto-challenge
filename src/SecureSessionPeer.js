const nacl = require('libsodium-wrappers');
const Decryptor = require('./Decryptor');
const Encryptor = require('./Encryptor');

module.exports = async (peer) => {
    await nacl.ready;
    let keys = nacl.crypto_kx_keypair();
    let encryptor, decryptor;
    let sharedKeys;


    //use OtherPeer to create and use Shared Keys
    let initConnecting = (_otherPeer) => {
        otherPeer = _otherPeer
        sharedKeys = nacl.crypto_kx_server_session_keys(keys.publicKey, keys.privateKey, otherPeer.publicKey);
        initCryptography();
        otherPeer.connect(self);
    }

    let initCryptography = async () => {
        encryptor = await Encryptor(sharedKeys.sharedTx);
        decryptor = await Decryptor(sharedKeys.sharedRx);
    }

    let self = Object.freeze({
        publicKey: keys.publicKey,

        encrypt: (msg) => (encryptor.encrypt(msg)),
        decrypt: (cipher, nonce) => (decryptor.decrypt(cipher, nonce)),
        connect: async (connectedPeer) => {
            otherPeer = connectedPeer;
            sharedKeys = nacl.crypto_kx_client_session_keys(keys.publicKey, keys.privateKey, otherPeer.publicKey);
            initCryptography()
        },

    })

    //Init App

    if (peer) initConnecting(peer);

    return self;
}