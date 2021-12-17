#!/bin/bash
source ../.env

# remove whitespace
DOMAIN="$REACT_APP_CLIENT_HOST"


echo "--------------SSL Certificate Generation Started-------------"
​
echo -n "Enter your email and press [ENTER]: "
read EMAIL
​
if [ ! -x "$(command -v certbot)" ] ; then
    DISTRO=$(lsb_release -is)
    DISTRO_VERSION=$(lsb_release -rs)
    if [ "$DISTRO" = "Debian" ]; then
        apt-get update
        apt-get -y install certbot
    elif [ "$DISTRO" = "Ubuntu" ]; then
        if [ "$DISTRO_VERSION" = "20.04" ] || [ "$DISTRO_VERSION" = "19.10" ]; then
                apt-get update
                apt-get -y install software-properties-common
                add-apt-repository -y universe
                apt-get update
                apt-get -y install certbot
        elif [ "$DISTRO_VERSION" = "18.04" ]; then
                apt-get update
                apt-get -y install software-properties-common
                add-apt-repository -y universe
                add-apt-repository -y ppa:certbot/certbot
                apt-get update
                apt-get -y install certbot
        fi
    else
        echo "$DISTRO $DISTRO_VERSION is not supported"
        echo "Only Debian 9,10 and Ubuntu 18.04,19.10,20.04 are supported"
        exit 1
    fi
fi
​
CERT_KEY="/etc/letsencrypt/live/$DOMAIN/privkey.pem"
CERT_CRT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"


/usr/bin/certbot certonly --noninteractive \
--standalone -d $DOMAIN \
--agree-tos --email $EMAIL


ln -s "$CERT_CRT" ./ssl/cert.crt
ln -s "$CERT_KEY" ./ssl/cert.key
