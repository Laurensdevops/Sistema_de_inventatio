#!/bin/bash

sudo docker run --name mongo_sistema_ayd_dev -p=27017:27017 -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=1234 mongo
