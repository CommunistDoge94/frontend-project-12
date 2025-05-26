build:
	cd frontend && npm run build

start: 
	npx start-server -s ./frontend/dist

install:
	npm install && cd frontend && npm install