
CONTAINER=gidea

SERVE_PORT?=7000

WORK_DIR=$(CURDIR)

start: stop
	docker rm $(CONTAINER) || echo ''
	docker run --name $(CONTAINER) -v $(WORK_DIR):/usr/murph -p $(SERVE_PORT):3000 -e CHOKIDAR_USEPOLLING=true murphyl/nodejs sh -c "npm run cheatsheets && npm run serve"

restart:
	docker restart $(CONTAINER)

stop:
	docker stop $(CONTAINER) || echo ''

install:
	docker run -v $(WORK_DIR):/usr/murph murphyl/nodejs npm install