all: deploy

compile: clean
	npx tsc

deploy: compile
	now && now alias

clean:
	rm -r dist
