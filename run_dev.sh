#!/bin/bash

export PORT=3001
npm run start &>/dev/null&

cd backend/g-and-d
unset PORT

mongo_dev_user=root
mongo_dev_password=1234

export PAYLOAD_SECRET=my_little_secret
export DATABASE_URI="mongodb://${mongo_dev_user}:${mongo_dev_password}@127.0.0.1:27017"
npm run dev
