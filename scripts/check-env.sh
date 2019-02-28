#!/bin/bash

fis3 inspect $NODE_ENV --root "$SOURCE_FOLDER" --file "$FIS_CONFIG_FILE" --lint --verbose --no-color | node "./scripts/check-fis3-dependencies.js" > "$LOG_FILE" || error
