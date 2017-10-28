#!/bin/sh
# `setuser` is part of baseimage-docker. `setuser mecached xxx...` runs the given command
cd /home/app/kummerkasten
exec  bundle exec rake qc:work >>/home/app/kummerkasten/log/queue_classic.log
