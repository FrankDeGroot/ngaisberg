@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Testacular (npm install -g testacular)

set BASE_DIR=%~dp0
set PHANTOMJS_BIN=%APPDATA%\npm\node_modules\phantomjs\lib\phantom\phantomjs.exe
set CHROME_BIN=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
start testacular start "%BASE_DIR%\..\config\testacular-e2e.conf.js" %*
