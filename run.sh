#!/bin/bash

# Initialize conda
source ~/anaconda3/etc/profile.d/conda.sh

# Function to run commands in a specific directory
run_in_directory() {
    local dir=$1
    shift
    local commands=$@

    echo "Entering directory: $dir"
    cd $dir || exit
    eval $commands
    cd - || exit
}

# Function to kill process on a specific port
kill_process_on_port() {
    local port=$1
    PID=$(lsof -t -i:$port)

    if [ -n "$PID" ]; then
        kill -9 $PID
        echo "Process on port $port has been terminated."
    else
        echo "No process is running on port $port."
    fi
}

# Trap to catch interrupt signal and kill all background processes
trap "echo 'Terminating all processes'; pkill -P $$; exit 1" SIGINT

# Activate conda environment
conda activate flask

# Kill processes on specific ports before starting
kill_process_on_port 3000  # Example port, replace with actual port if needed
kill_process_on_port 3001  # Example port, replace with actual port if needed
kill_process_on_port 3002 
kill_process_on_port 3003
 
# Main Page
run_in_directory "frontend" "npm start &"

# Calendar
run_in_directory "calendar-ui" "npm run dev &"

# Chat & Recommend Bot
run_in_directory "llm-ui" "npm start &"

# Memo
run_in_directory "memo-ui" "npm start &"

# Backend
run_in_directory "backend" "python app.py &"

echo "All submodules are running."

# Wait for all background processes to finish
wait
