# Stop all servers and start the server as a daemon
cd /home/ubuntu/octopus
sudo yarn install
sudo yarn server:build
sudo yarn build
sudo pm2 start API_LOCAL
