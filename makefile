all: deploy

compile:
	rm -r dist
	npx tsc

deploy: compile
	now && now alias

clean:
	rm -r dist
	rm -r node_modules
