
const CryptoJS = require('crypto-js')

CryptoJS.algo.AES.keySize = 32
function AesDecrypt(word, keyIn) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const key = CryptoJS.enc.Utf8.parse(keyIn)
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function AesEncrypt(word, keyIn) {
  console.log(CryptoJS.algo.AES)
  let srcs = CryptoJS.enc.Utf8.parse(word);
  const key = CryptoJS.enc.Utf8.parse(keyIn)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}


function Base64Encode(val) {
  let str = CryptoJS.enc.Utf8.parse(val);
  let base64 = CryptoJS.enc.Base64.stringify(str);
  return base64;
}

function Base64Decode(val) {
  let words = CryptoJS.enc.Base64.parse(val);
  return words.toString(CryptoJS.enc.Utf8);
}

function Md5(val) {
  let words = CryptoJS.enc.Base64.parse(val);
  return CryptoJS.MD5(val).toString()
}

module.exports = {
  AesEncrypt,
  AesDecrypt,
  Base64Encode,
  Base64Decode,
  Md5
}