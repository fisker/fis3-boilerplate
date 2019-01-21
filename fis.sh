#!/bin/bash

# consts
PROJECT_CONFIG_FILE=./project.config.js
FIS_CONFIG_FILE=`node -p "require('$PROJECT_CONFIG_FILE').build.config"`
SOURCE_FOLDER=`node -p "require('$PROJECT_CONFIG_FILE').build.src"`
LOG_FILE=`node -p "require('$PROJECT_CONFIG_FILE').build.log"`
SERVER_TYPE=`node -p "require('$PROJECT_CONFIG_FILE').server.type"`
SERVER_PORT=`node -p "require('$PROJECT_CONFIG_FILE').server.config.port"`
DIST_FOLDER=`node -p "require('$PROJECT_CONFIG_FILE').build.dist"`
TEMP_RESOURCE_FOLDER=$DIST_FOLDER/`node -p "require('$PROJECT_CONFIG_FILE').build.temp"`
PLATFORM=`node -p "process.platform"`
ENV_PATH_SEP=":"
if [ "$PLATFORM" = "win32" ]; then
  ENV_PATH_SEP=";"
fi
PWD=`pwd`

# env
export NODE_PATH=$NODE_PATH$ENV_PATH_SEP`npm -g root`

function main() {
  clear
  echo ""
  echo "                       fis3 debug & distribute script"
  echo ""
  echo "                            see http://fis.baidu.com"
  echo "                      by fisker Cheung lionkay@gmail.com"
  echo ""
  echo ""
  echo "==============================================================================="
  echo ""
  echo ""
  echo "                  1. debug (default)"
  echo ""
  echo "                  2. distribute"
  echo ""
  echo "                  3. distribute & archive"
  echo ""
  echo "                  Q. quit"
  echo ""
  echo ""

  # chose operation
  read -t 5 -n1 -p "Please choose an option:" choice
  case "$choice" in
    2)
      export NODE_ENV="production"
      clear
      checkDependencies
      release
      end
      ;;
    3)
      export NODE_ENV="production"
      clear
      checkDependencies
      release
      archive
      end
      ;;
    q|Q)
      quit
      ;;
    *)
      export NODE_ENV="development"
      clear
      checkDependencies
      debug
      pause
      ;;
  esac
}

function checkDependencies() {
  echo "..............................................................................."
  echo "check dependencies"
  fis3 inspect $NODE_ENV --root "$SOURCE_FOLDER" --file "$FIS_CONFIG_FILE" --lint --verbose --no-color | node "./scripts/check-dependencies.js" > "$LOG_FILE" || error
}

function release() {
  # remove release file and log file
  if [ -d "$DIST_FOLDER" ]; then
    rm -r "$DIST_FOLDER"
  fi
  if [ -f "$LOG_FILE" ]; then
    rm "$LOG_FILE"
  fi

  # release file
  echo "..............................................................................."
  echo "releasing files"
  fis3 release $NODE_ENV --dest "$DIST_FOLDER" --root "$SOURCE_FOLDER" --file "$FIS_CONFIG_FILE" --clean --unique --lint --verbose --no-color > "$LOG_FILE" || error

  if [ -d "$TEMP_RESOURCE_FOLDER" ]; then
    rm -r "$TEMP_RESOURCE_FOLDER"
  fi

  echo "..........................................................................done."
  echo ""
}

# archive
function archive() {
  echo "archive"

  ARCHIVE_FOLDER=`node -p "require('$PROJECT_CONFIG_FILE').build.archive"`
  ARCHIVE_TYPE=`node -p "require('$PROJECT_CONFIG_FILE').build.archiveType"`
  ARCHIVE_FILE=`node -p "require('$PROJECT_CONFIG_FILE').build.archiveFile"`

  # make distribute folder ready
  if [ ! -d "$ARCHIVE_FOLDER" ]; then
    mkdir "$ARCHIVE_FOLDER"
  fi

  # archive files to distribute folder
  echo "..............................................................................."
  echo "packing files"

  if [ "$ARCHIVE_TYPE" = "tar.gz" ]; then
    targz -l 9 -m 9 -c "$DIST_FOLDER" "$ARCHIVE_FOLDER/$ARCHIVE_FILE.tar.gz" || pause
  else
    winzip zip "$DIST_FOLDER" "$ARCHIVE_FOLDER/$ARCHIVE_FILE" || pause
  fi

  start "$ARCHIVE_FOLDER"

  echo "..........................................................................done."
}

#debug
function debug() {
  # stop server
  echo "..............................................................................."
  echo "stop server"
  fis3 server stop || pause
  # if errorlevel 1 ( pause )
  echo "..........................................................................done."
  echo ""

  # clean up
  echo "..............................................................................."
  echo "clean up server folder"
  fis3 server clean || pause
  # if errorlevel 1 ( pause )
  echo "..........................................................................done."
  echo ""

  # start server
  echo "..............................................................................."
  echo "start server"
  fis3 server start --type $SERVER_TYPE --port $SERVER_PORT || pause
  echo "..........................................................................done."
  echo ""

  # start watch
  echo "..............................................................................."
  echo "watching files"
  fis3 release $NODE_ENV --root "$SOURCE_FOLDER" --file "$FIS_CONFIG_FILE" --clean --verbose --watch
}

function pause() {
  echo "press any key to continue."
  read -n 1
}

function error() {
  echo "..............................................................................."
  echo "                                error occurred"
  echo "..............................................................................."
  echo ""
  cat "$LOG_FILE"
  pause
  end
}

function end() {
  echo "exit in 5 seconds"
  sleep 5
  exit
}

main

