const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/0.0.0.0/tcp/5001');

async function uploadAndPin(buffer) {
  const resp = await ipfs.files.add(buffer);
  const hash = resp[0].hash;
  await ipfs.pin.add(hash);
  return hash;
}

module.exports = uploadAndPin;
