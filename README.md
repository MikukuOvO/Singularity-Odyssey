# Singularity Odyssey
## Introduction
The project "Singularity Odyssey" is an integrated application that combines calendar, natural language processing,
intelligent recommender, and personal memo functionalities.

Inspired by astronomical phenomena and literary philosophical concepts, it aims to enhance the quality of life for users,
promoting personal growth and social connection through the power of technology.

## Video


https://github.com/MikukuOvO/Singularity-Odyssey/assets/118185781/67138105-3fc8-4876-a2f6-b3a588098d1a



## Requirements
```
Node.js
flask
```

## Build
Our project is based on several submodules, which need to be run separately.
### Main Page
```
cd frontend
npm install
npm start
```
### Calendar
```
cd calendar-ui
npm install
npm run dev
```
### Chat & Recommed Bot
```
cd llm-ui
npm install
npm start
```
### Memo
```
cd memo-ui
npm install
npm start
```
### backend
```
cd backend
python app.py
```

## Run
After built the project, you can also run it automically.
```
./run.sh
```
