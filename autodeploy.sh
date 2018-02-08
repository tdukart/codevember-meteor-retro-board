#!/bin/bash
LOG="$(npm run dev-deploy)"
echo ""
echo "---DEPLOY $(date)---" >> ~/Library/Logs/retroboard.log
echo $LOG >> ~/Library/Logs/retroboard.log
if hash alerter 2>/dev/null; then
  alerter -message "Retro Board deployed"
elif hash terminal-notifier 2>/dev/null; then
  terminal-notifier -message "Retro Board deployed"
fi
