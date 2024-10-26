#!/bin/sh
# This script creates the version.txt file needed for displaying the version number in currently served web app  
# copy this script in .git/hooks folder of the repo and give it executable permission in order to have it working
gitversion > version.txt