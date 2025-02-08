#!/bin/bash

docker_name=mongo_sistema_ayd_dev

sudo docker kill ${docker_name}
sudo docker rm ${docker_name}
