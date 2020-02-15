# WeIPFS
## An IPFS API server for processing file uploads to a localy hosted IPFS node. This can be used with the [WeYouMe Application](https://github.com/weyoume/weapp) to facilitate image uploading on the endpoint ipfs.yourdomain.com/upload

# Setup:
1. Extract the repository to your server and create the data storage directories.
   ```
   git clone https://github.com/weyoume/weipfs
   mkdir /data/ipfs
   mkdir /data/staging
   ```
2. Host a local IPFS node using the [startipfs.sh](scripts/startipfs.sh) script. This will create a dockerized node with required ports forwarded.
3. Point your server's nginx.conf file (or apache equivalent) to the endpoints at:
   1.  ipfs.yourdomain.com/ipfs -> port 8080       // This is the IPFS Gateway for viewing files using your node. 
   2.  ipfs.yourdomain.com/upload -> port 4000     // This is the port used by this API for handling file uploads.
   3.  ipfs.yourdomain.com/ -> port 5001           // This is the port used by the IPFS API for pinning files to your node.
4. Ensure that you have added an entry into your nginx.conf file to handle image requests larger than 1MB. Without this entry, you will encounter the error: [413 Request Entity Too Large](https://www.keycdn.com/support/413-request-entity-too-large)
```
    server {
        client_max_body_size 100M;
        ...
    }
```
5. Ensure that your server's ports (typically in your VPS security group settings) are open on values of 8080, 4000 and 5001.
6. Ensure that your IPFS node has its CORS settings open to requests:
```
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin  '["*"]'
docker exec ipfs_host ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
```
7. Ensure that you have installed Yarn, and GraphicsMagick on your server ( substitute apt-get for your desired package manager i.e. yum , brew ), and then run the deployment script:
```
apt-get update
apt-get install -y graphicsmagick
npm install yarn
yarn install --non-interactive --frozen-lockfile
yarn deploy
```

## Learn more at:

### [IPFS.io](https://ipfs.io)

### [go-ipfs](https://github.com/ipfs/go-ipfs)

### [js-ipfs-http-client](https://github.com/ipfs/js-ipfs-http-client)

IPFS README: https://ipfs.weyoume.io/ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme

WeYouMe Whitepaper: https://ipfs.weyoume.io/ipfs/QmacFgC3osnZS2oAAkV5cDXaHBkifZo2JjXkB2X52TUPwA



