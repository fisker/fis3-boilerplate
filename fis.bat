@echo off
:: const
set CONFIG_FILE=fis-conf.js
set SOURCE_FOLDER=src
set DIST_FOLDER=dist
set SERVER_TYPE=browsersync
set SERVER_PORT=3000
set SERVER_CONFIG=build/bs-config.js
:: java,php,node,jello...
set ARCHIVE_FOLDER=archive
set ARCHIVE_FILETYPE=zip
:: zip,tar.gz  ; tar.gz do NOT support chinese filename
set LOG_FILE=release.log
set TEMP_RESOURCE_FOLDER=.temp
:: default media
set NODE_ENV=dev

:: reset config file if another config files exists in sourcefolder
if exist "./%SOURCE_FOLDER%/fis-conf.js" (set CONFIG_FILE=%SOURCE_FOLDER%/fis-conf.js)

:: init window
REM chcp 65001
title fis3 debug ^& distribute script
color 37
REM mode con cols=80 lines=25

:: menu
echo.
echo ===============================================================================
echo                        fis3 debug ^& distribute script
echo                             see http://fis.baidu.com
echo                       by fisker Cheung lionkay@gmail.com
echo ===============================================================================
echo.
echo.
echo.
echo.                  1. debug (default)
echo.
echo.                  2. distribute
echo.
echo.                  3. distribute ^& archive
echo.
echo.                  Q. quit
echo.
echo.
echo.
echo.
echo.
echo.

:: chose operation
choice /N /C 123Q /D 1 /T 5 /M "Please choose an option:"
set choice=%errorlevel%
dir > nul ::reset errorlevel
if "%choice%"=="4" ( cls & goto end )
if "%choice%"=="3" (
  set NODE_ENV=production
  goto release
)
if "%choice%"=="2" (
  set NODE_ENV=production
  goto release
)
if "%choice%"=="1" ( goto debug )
goto end

:: archive
:archive

:: make distribute folder ready
if not exist "./%ARCHIVE_FOLDER%" md "./%ARCHIVE_FOLDER%"

:: set distribute file name
for /f "delims=" %%i in ("%cd%") do set FOLDER=%%~ni
set hour=%time:~0,2%
if /i %hour% LSS 10 (set hour=0%time:~1,1%)
set DIST_FILENAME=%FOLDER%.%date:~2,2%%date:~5,2%%date:~8,2%-%hour%%time:~3,2%%time:~6,2%

:: archive files to distribute folder
echo ...............................................................................
echo packing files
if "%ARCHIVE_FILETYPE%"=="tar.gz" ( call targz -l 9 -m 9 -c "./%DIST_FOLDER%" "./%ARCHIVE_FOLDER%/%DIST_FILENAME%.tar.gz" ) else ( call winzip zip "./%DIST_FOLDER%" "./%ARCHIVE_FOLDER%/%DIST_FILENAME%" )
if errorlevel 1 ( pause )
echo ..........................................................................done.
echo.

:: quit
goto end

:: relase
:release
cls

:: remove release file and log file
echo ...............................................................................
echo clean release folder
if exist "./%DIST_FOLDER%" rd /S /Q "./%DIST_FOLDER%"
if exist "./%LOG_FILE%" del /Q "./%LOG_FILE%"
echo ..........................................................................done.
echo.

:: release file
echo ...............................................................................
echo releasing files
call fis3 release %NODE_ENV% --dest "./%DIST_FOLDER%" --root "./%SOURCE_FOLDER%" --file "./%CONFIG_FILE%" --clean --unique --lint --verbose --no-color > "./%LOG_FILE%"
if errorlevel 1 ( goto error )
if exist "./%DIST_FOLDER%/%TEMP_RESOURCE_FOLDER%" rd /S /Q "./%DIST_FOLDER%/%TEMP_RESOURCE_FOLDER%"
echo ..........................................................................done.
echo.

if "%choice%"=="3" ( goto archive )

:: quit
goto end


:: debug
:debug
cls

:: check java server
if /i "%SERVER_TYPE%"=="java" (
  call java -version > nul
  if errorlevel 1 ( set SERVER_TYPE=node )
)

:: check php server
if /i "%SERVER_TYPE%"=="php" (
  call php -v > nul
  if errorlevel 1 ( set SERVER_TYPE=node )
)

:: stop server
echo ...............................................................................
echo stop server
call fis3 server stop
if errorlevel 1 ( pause )
echo ..........................................................................done.
echo.

:: clean up
echo .......................................................
echo clean up server folder
call fis3 server clean
if errorlevel 1 ( pause )
echo ..........................................................................done.
echo.

:: start server
echo ...............................................................................
echo start server
call fis3 server start --type %SERVER_TYPE% --port %SERVER_PORT% --bs-config "./%SERVER_CONFIG%"
REM start cmd /C "color 37 & fis3 server start --type %SERVER_TYPE% --qrcode & ping -n 60 127.0.0.1 > nul"
REM call fis3 server start --port %SERVER_PORT% --type %SERVER_TYPE%
if errorlevel 1 ( pause )
echo ..........................................................................done.
echo.

:: start livereload
echo ...............................................................................
echo watching files
call fis3 release %NODE_ENV% --root "./%SOURCE_FOLDER%" --file "./%CONFIG_FILE%" --clean --verbose --watch --verbose
pause

:: error
:error
REM cls
echo ...............................................................................
echo                                 error occurred
echo ...............................................................................
echo.
type "./%LOG_FILE%"
:: don't quote filename here
start ./%LOG_FILE%
pause
goto end

:: quit
:end
echo exit in 5 seconds
ping -n 5 127.0.0.1 > nul
