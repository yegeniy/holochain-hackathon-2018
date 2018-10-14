#!/usr/bin/env bash

pwd
#TODO: What holochain port to use?
# docker run --rm -d -it --name holo41 -p 4141:4141 -p 6141:6143 -v $(pwd):/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo41 -p 4141:4141 -p 6141:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo42 -p 4142:4141 -p 6142:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo80 -p 8080:4141 -p 6180:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web

sleep 5; 

echo
echo as a potential user, search for \'test\' groups

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4141/fn/meetup/listGroupsByTag" -H "accept: text/plain" -H "Content-Type: text/plain" -d 'test'
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo as an inspired host, with none found... create a group

if [[ -z $1 ]]; then set -x; fi
HASH=`curl -s -X POST "http://127.0.0.1:4141/fn/meetup/groupCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"name":"meet to test"}'`
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo and an event with that tag

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4141/fn/meetup/eventCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"name":"test eventually", "groupHash":'$HASH', "date":"2018-10-14T17:00:00", "location":"somewhere so cool, we can not tell you just yet", "tags": ["test"]}'
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo as another potential user, find a group

if [[ -z $1 ]]; then set -x; fi
HASH=`curl -s -X POST "http://127.0.0.1:4142/fn/meetup/listGroupsByTag" -H "accept: text/plain" -H "Content-Type: text/plain" -d 'test'`
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo cool, I will join that...

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4142/fn/meetup/joinGroup" -H "accept: text/plain" -H "Content-Type: text/plain" -d $HASH
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo maybe they have good events

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4142/fn/meetup/listEventsByGroup" -H "accept: text/plain" -H "Content-Type: text/plain" -d $HASH
if [[ -z $1 ]]; then set +x; else read; fi

echo
echo "we will attend that ... (handoff to Tarot Card App / presentation ???)"

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4142/fn/meetup/joinGroup" -H "accept: text/plain" -H "Content-Type: text/plain" -d $HASH
if [[ -z $1 ]]; then set +x; else read; fi

read -p 'press ENTER to STOP'
docker stop holo41 holo42 holo80