# cmd-line-interactive

Run the app

1. Create .env file from .env.example
2. Run "yarn" cmd for dependencies installation
3. To run the app use "yarn start"


Note : Used dataSync.js script for to import csv data in postgres db. However I won't recommend this script for large data set for following shortcomings - 

1. It uses just one connection from pool for inserts.
2. Data is not being inserted in chunks of bulk inserts.
3. Could use child processes for parallel insertions of chunked data.