# Stop all servers and start the server as a daemon
cd /home/ubuntu/octopus
sudo yarn install
sudo yarn build
sudo yarn start:server
