
const CryptoJS = require('crypto-js')

// CryptoJS.algo.AES.keySize = 8
function AesDecrypt(word, keyIn) {
  // let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const key = CryptoJS.enc.Utf8.parse(keyIn)
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypt.toString(CryptoJS.enc.Utf8);
}

function AesEncrypt(word, keyIn) {
  // let srcs = CryptoJS.enc.Utf8.parse(word);
  const key = CryptoJS.enc.Utf8.parse(keyIn)
  console.log(key)
  let encrypted = CryptoJS.AES.encrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
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