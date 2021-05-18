#!/bin/bash

# Install node.js
sudo apt-get update
sudo apt-get install nodejs -y

# Install yarn
npm install --global yarn

# Install pm2 module 
sudo yarn add pm2