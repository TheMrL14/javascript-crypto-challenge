const nacl = require("libsodium-wrappers");
const Decryptor = require("./Decryptor");
const Encryptor = require("./Encryptor");

module.exports = async (peer) => {
  await nacl.ready;

  let keys = nacl.crypto_kx_keypair();
  let encryptor, decryptor;
  let sharedKeys;
  let newMsgQueue = [];
  let otherPeer = peer;

  //use OtherPeer to create and use Shared Keys
  let initConnecting = (_otherPeer) => {
    otherPeer = _otherPeer;
    sharedKeys = nacl.crypto_kx_server_session_keys(
      keys.publicKey,
      keys.privateKey,
      otherPeer.publicKey
    );
    initCryptography(sharedKeys.sharedTx, sharedKeys.sharedRx);
    otherPeer.connect(self); //connect otherPeer to current Peer
  };

  //Create encryptor and decryptor with generated Keysa
  let initCryptography = async (encryptKey, decryptKey) => {
    encryptor = await Encryptor(encryptKey);
    decryptor = await Decryptor(decryptKey);
  };

  // public object
  let self = Object.freeze({
    publicKey: keys.publicKey,
    encrypt: (msg) => encryptor.encrypt(msg),
    decrypt: (cipher, nonce) => decryptor.decrypt(cipher, nonce),
    connect: async (connectedPeer) => {
      otherPeer = connectedPeer;
      sharedKeys = nacl.crypto_kx_client_session_keys(
        keys.publicKey,
        keys.privateKey,
        otherPeer.publicKey
      );
      initCryptography(sharedKeys.sharedTx, sharedKeys.sharedRx);
    },
    send: (newMsg) => {
      const encryptedMsg = self.encrypt(newMsg);
      otherPeer.addToMsgQueue(encryptedMsg);
    },
    receive: () => {
      if (newMsgQueue.length <= 0) throw "No new messages";
      const encryptedMsg = newMsgQueue.shift();
      const msg = self.decrypt(encryptedMsg.ciphertext, encryptedMsg.nonce);
      return msg;
    },
    addToMsgQueue: (msg) => newMsgQueue.push(msg),
  });

  //Check if peer param is passed
  // if yes => start connecting
  if (peer) initConnecting(peer);

  return self;
};
