#!/bin/bash
# Setup VM
echo "=============="
echo "SCRIPT STARTING"
echo "=============="

if [[ ! -e backend.env || ! -e frontend.env ]]
then
    echo "Necessary env files are missing. Please create it first before running this script."
    exit 1
fi

if [[ ! -e docker-compose.yaml ]]
then
    echo "Missing docker-compose file"
    exit 1
fi

echo "Downloading Docker"
curl -fsSL https://get.docker.com -o install-docker.sh

echo "Installing Docker"
sudo sh install-docker.sh

echo "Adding user into docker group"
sudo usermod -aG docker $USER

echo "Creating the containers"
sudo docker compose -f docker-compose.yaml up -d



echo "=============="
echo "SCRIPT FINISHED"
echo "=============="