const nacl = require('libsodium-wrappers');
const Decryptor = require('./Decryptor');
const Encryptor = require('./Encryptor');

module.exports = async (peer) => {
    await nacl.ready;
    
    let keys = nacl.crypto_kx_keypair();
    let sharedKeys;
    let encryptor;
    let decryptor;
    let otherpeer = peer
    //const state = nacl.crypto_secretstream_xchacha20poly1305_state_new()

   
    //Create shared keys from own public key 
    let createSharedKeys = async (otherPublicKey, otherKeysExist) => {
        sharedKeys = await nacl.crypto_kx_client_session_keys(keys.publicKey, keys.privateKey, otherPublicKey);
        encryptor = await Encryptor(sharedKeys.sharedTx);
        //decryptor = await Decryptor(sharedKeys.sharedRx);
        //let existing peer create shared keys
        if(!otherKeysExist) peer.connect(keys.publicKey);
    }

    /*let connectStream = () => {
        let res = nacl.crypto_secretstream_xchacha20poly1305_init_push(sharedKeys.sharedTx);
        let [state_out, header] = [res.state, res.header];
    }*/

    /*let pushStream = (msg) = {
        c1 = nacl.crypto_secretstream_xchacha20poly1305_push(state_out,
            nacl.from_string(msg), null,
            nacl.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
    }*/

  // if other peer is passed as param
  if (otherpeer) createSharedKeys(otherpeer.publicKey,false);


    return Object.freeze({
        publicKey: keys.publicKey,
        currentHeader: null,
        encrypt: msg => (encryptor.encrypt(msg)),
        decrypt: (ciphertext, nonce) => (decryptor.decrypt(ciphertext, nonce)),
        connect: otherPublicKey => createSharedKeys(otherPublicKey, true),
        send: msg => {
            //connectStream();
            //pushStream(msg);
        },
        receive: () => {

        },
    })
}