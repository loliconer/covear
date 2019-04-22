#! /bin/bash

rsync -avz --delete --exclude-from 'deploy_exclude.txt' dist/ rss@119.23.46.51:~/project
