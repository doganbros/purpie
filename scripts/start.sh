# Stop all servers and start the server as a daemon
cd /home/ubuntu/codebase/octopus
sudo yarn install
sudo yarn build
sudo pm2 start API_LOCAL
