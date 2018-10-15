#!/usr/bin/env bash

pwd
#TODO: What holochain port to use?
# docker run --rm -d -it --name holo41 -p 4141:4141 -p 6141:6143 -v $(pwd):/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo41 -p 4141:4141 -p 6141:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo42 -p 4142:4141 -p 6142:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web
docker run --rm -d -it --name holo80 -p 8080:4141 -p 6180:6143 -v "`pwd`":/app -w /app holochain/holochain-proto:develop hcdev web

sleep 3; 

echo;echo;echo
echo ">    As a potential user (41), search for 'test' groups to join"

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4141/fn/meetup/listGroupsByTag" -H "accept: text/plain" -H "Content-Type: text/plain" -d 'test'
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    As an inspired host, with no groups found... create a group"

if [[ -z $1 ]]; then set -x; fi
HASH=`curl -s -X POST "http://127.0.0.1:4141/fn/meetup/groupCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"name":"meet to test"}'`
echo $HASH
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    And we'll set up a kickoff event tagged as a 'test'"

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4141/fn/meetup/eventCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"name":"test eventually", "groupHash":'$HASH', "date":"2018-10-14T17:00:00", "location":"somewhere so cool, we can not tell you just yet", "tags": ["test"]}'
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    As another potential user (42), let's find a group with the 'test' tag"

if [[ -z $1 ]]; then set -x; fi
HASH=`curl -s -X POST "http://127.0.0.1:4142/fn/meetup/listGroupsByTag" -H "accept: text/plain" -H "Content-Type: text/plain" -d 'test' | jq '.[0]' - | cut -c 2- | rev | cut -c 2- | rev`
echo $HASH
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    Cool, I will join that..."

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4142/fn/meetup/joinGroup" -H "accept: text/plain" -H "Content-Type: text/plain" -d "$HASH"
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    Maybe they have good events coming up?"

if [[ -z $1 ]]; then set -x; fi
EVENT=`curl -s -X POST "http://127.0.0.1:4142/fn/meetup/listEventsByGroup" -H "accept: text/plain" -H "Content-Type: text/plain" -d $HASH` # | jq '.[0]' -`
echo $EVENT | jq '.' -
HASH=`echo $EVENT | jq 'keys[0]' - | cut -c 2- | rev | cut -c 2- | rev`
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    We will attend that ... and bring a friend" 
# TODO: Add optional "who" to rsvp
if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4142/fn/meetup/rsvpCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"event":"'$HASH'"}'
if [[ -z $1 ]]; then set +x; else read; fi

echo ">    As someone anonymous(80), we will attend that as well... and bring a friend" 
curl -s -X POST "http://127.0.0.1:8080/fn/meetup/rsvpCreate" -H "accept: text/plain" -H "Content-Type: application/json" -d '{"event":"'$HASH'", "attendees":2}'

echo;echo;echo
echo ">    As the host (41), I wonder who is attending?"

if [[ -z $1 ]]; then set -x; fi
curl -s -X POST "http://127.0.0.1:4141/fn/meetup/listRsvps" -H "accept: text/plain" -H "Content-Type: text/plain" -d $HASH # | jq '.'
if [[ -z $1 ]]; then set +x; else read; fi

echo;echo;echo
echo ">    TODO: bridge over to other apps right from the meetup?"

echo
read -p 'press ENTER to STOP'
docker stop holo41 holo42 holo80
