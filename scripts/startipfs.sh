#!/bin/bash

docker run -d --name ipfs_host -v /data/staging/:/export -v /data/ipfs/:/data/ipfs -p 4001:4001 -p 8080:8080 -p 5001:5001 ipfs/go-ipfs:latest