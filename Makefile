.PHONY: build run ci ssh clean
root = $(shell pwd)
domain = $(shell ls projects/domain)
application = $(shell ls projects/application)
adapters = $(shell ls projects/adapters)
bundles = $(shell ls projects/bundles)
libraries = $(shell ls projects/libraries)

build:
	@docker build -t smjs .

run:
	@docker run --rm smjs

# We must NOT build all packages first and then run tests. When a package depends on another local package, the
# dependency is copied with all its node_modules directory included, and this has been observed to mess up tests.
# Instead, what we want is to run tests for a package when all local dependencies have been copied without their
# node_modules directory, so we clean all packages before running tests on a specific one.
ci:
	@yarn >/dev/null && yarn ci
	@$(foreach project,$(domain),printf "\n\nRUNNING CI FOR $(project)...\n" && cd $(root) && make clean >/dev/null && cd $(root)/projects/domain/$(project) && yarn >/dev/null && yarn ci &&) true
	@$(foreach project,$(application),printf "\n\nRUNNING CI FOR $(project)...\n" && cd $(root) && make clean >/dev/null && cd $(root)/projects/application/$(project) && yarn >/dev/null && yarn ci &&) true
	@$(foreach project,$(adapters),printf "\n\nRUNNING CI FOR $(project)...\n" && cd $(root) && make clean >/dev/null && cd $(root)/projects/adapters/$(project) && yarn >/dev/null && yarn ci &&) true
	@$(foreach project,$(bundles),printf "\n\nRUNNING CI FOR $(project)...\n" && cd $(root) && make clean >/dev/null && cd $(root)/projects/bundles/$(project) && yarn && yarn >/dev/null ci &&) true
	@$(foreach project,$(libraries),printf "\n\nRUNNING CI FOR $(project)...\n" && cd $(root) && make clean >/dev/null && cd $(root)/projects/libraries/$(project) && yarn >/dev/null && yarn ci &&) true

ssh:
	@docker run -ti --rm -v $(root):/app:delegated smjs bash

clean:
	@$(foreach project,$(domain),cd $(root)/projects/domain/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true
	@$(foreach project,$(application),cd $(root)/projects/application/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true
	@$(foreach project,$(adapters),cd $(root)/projects/adapters/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true
	@$(foreach project,$(libraries),cd $(root)/projects/libraries/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true
	@$(foreach project,$(bundles),cd $(root)/projects/bundles/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true
