#!/usr/bin/env bash

function generatePassword() {
    openssl rand -hex $1
}

JICOFO_AUTH_PASSWORD=$(generatePassword 16)
JVB_AUTH_PASSWORD=$(generatePassword 16)
JIGASI_XMPP_PASSWORD=$(generatePassword 16)
JIBRI_RECORDER_PASSWORD=$(generatePassword 16)
JIBRI_XMPP_PASSWORD=$(generatePassword 16)
OCTOPUS_API_KEY=$(generatePassword 25)
OCTOPUS_API_SECRET=$(generatePassword 35)

sed -i "" \
    -e "s#JICOFO_AUTH_PASSWORD=.*#JICOFO_AUTH_PASSWORD=${JICOFO_AUTH_PASSWORD}#g" \
    -e "s#JVB_AUTH_PASSWORD=.*#JVB_AUTH_PASSWORD=${JVB_AUTH_PASSWORD}#g" \
    -e "s#JIGASI_XMPP_PASSWORD=.*#JIGASI_XMPP_PASSWORD=${JIGASI_XMPP_PASSWORD}#g" \
    -e "s#JIBRI_RECORDER_PASSWORD=.*#JIBRI_RECORDER_PASSWORD=${JIBRI_RECORDER_PASSWORD}#g" \
    -e "s#JIBRI_XMPP_PASSWORD=.*#JIBRI_XMPP_PASSWORD=${JIBRI_XMPP_PASSWORD}#g" \
    -e "s#OCTOPUS_API_KEY=.*#OCTOPUS_API_KEY=${OCTOPUS_API_KEY}#g" \
    -e "s#OCTOPUS_API_SECRET=.*#OCTOPUS_API_SECRET=${OCTOPUS_API_SECRET}#g" \
    "$(dirname "$0")/.env"