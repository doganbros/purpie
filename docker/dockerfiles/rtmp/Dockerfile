FROM tiangolo/nginx-rtmp

RUN apt-get update && apt-get install -y unzip && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install

RUN apt-get install jq -y

RUN apt-get install curl -y