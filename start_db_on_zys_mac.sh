#!/bin/sh

mongoPath="/Users/yinz/Applications/mongodb"
dbPath="/Users/yinz/Desktop/db"

$mongoPath/bin/mongod --dbpath $dbPath --port 28933 --auth
