const fs = require('fs');
const util = require('util');
const express = require('express');
const compression = require('compression');
const multipart = require('connect-multiparty');
const debug = require('debug')('busy-ipfs');
const transferImage = require('./transferImage');
const uploadAndPin = require('./uploadAndPin');
const { MAX_FILE_SIZE } = require('./constants');
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('/ip4/0.0.0.0/tcp/5001');
const unlinkAsync = util.promisify(fs.unlink);
const app = express();
const multipartMiddleware = multipart();

app.use(compression());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * This API Accepts incoming image uploads, and converts them into a maximum dimension
 * output image. Returns a url to the IPFS image hosted on the Gateway of this node. 
 */
app.post('/upload', multipartMiddleware, async (req, res) => {
  try {
    const { file } = req.files;
    
    if (file.size > MAX_FILE_SIZE) {
      console.error( "Image uploaded exceeds max image size: ", file.size, MAX_FILE_SIZE );
      return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });
    }

    if (!file.type.match('image/.*')) {
      return res.status(415).json({ error: 'UNSUPPORTED_MEDIA_TYPE' });
    }

    const buffer = await transferImage(file)
      .catch( err => { console.error('err', err)});

    const hash = await uploadAndPin(buffer)
      .catch( err => { console.error('err', err)});

    await Promise.all(Object.values(req.files).map(file => unlinkAsync(file.path)));

    return res.json({ name: file.name, url: `https://ipfs.weyoume.io/ipfs/${hash}`, hash });
  } catch (err) {
    debug('Error occured during processing /upload', err);
    return res.status(501).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

const config = await ipfs.config.get()
  .then( res => res.json())
  .then( res => { console.info( "IPFS Node found with config: ", res ) } )
  .catch( err => { console.error('err', err)});

const swarm = await ipfs.swarm.peers()
  .then( res => res.json())
  .then( res => { console.info( "Connected to peers: ", res ) } )
  .catch( err => { console.error('err', err)});

const readme = await ipfs.cat("QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme")
  .then( res => res.json())
  .then( res => { console.info( res ) } )
  .catch( err => { console.error('err', err)});

const port = 4000;
app.listen(port);

console.log( "Listening on port: ", port );

console.log( "|| =========================== ||" );
console.log( "|| ===== STARTING WEIPFS ===== ||" );
console.log( "|| =========================== ||" );