#!/bin/bash
source ../.env

# remove whitespace
DOMAIN="$REACT_APP_CLIENT_HOST"


echo "-------------------------------------------------------------------------"
echo "This script will:"
echo "- Need a working DNS record pointing to this machine(for domain ${DOMAIN})"
echo "- Download certbot-auto from https://dl.eff.org to /usr/local/sbin"
echo "- Install additional dependencies in order to request Let’s Encrypt certificate"
echo "- If running with jetty serving web content, will stop Jitsi Videobridge"
echo "- Configure and reload nginx or apache2, whichever is used"
echo "- Configure the coturn server to use Let's Encrypt certificate and add required deploy hooks"
echo "- Add command in weekly cron job to renew certificates regularly"
echo ""
echo "You need to agree to the ACME server's Subscriber Agreement (https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf) "
echo "by providing an email address for important account notifications"
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
# CRON_FILE="/etc/cron.weekly/letsencrypt-renew"
# if [ ! -d "/etc/cron.weekly" ] ; then
#     mkdir "/etc/cron.weekly"
# fi
# echo "#!/bin/bash" > $CRON_FILE
# echo "/usr/bin/certbot renew >> /var/log/le-renew.log" >> $CRON_FILE
​
CERT_KEY="/etc/letsencrypt/live/$DOMAIN/privkey.pem"
CERT_CRT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"


/usr/bin/certbot certonly --noninteractive \
--standalone -d $DOMAIN \
--agree-tos --email $EMAIL


ln -s "$CERT_CRT" ./ssl/cert.crt
ln -s "$CERT_KEY" ./ssl/cert.key
