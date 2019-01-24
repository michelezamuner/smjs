.PHONY: build ci ssh clean
root = $(shell pwd)
projects = $(shell ls projects)

# We must NOT build all packages first and then run tests. When a package depends on another local package, the
# dependency is copied with all its node_modules directory included, and this has been observed to mess up tests.
# Instead, what we want is to run tests for a package when all local dependencies have been copied without their
# node_modules directory, so we clean all packages before running tests on a specific one.
ci:
	@yarn && yarn ci
	@$(foreach project,$(projects),cd $(root) && make clean && cd $(root)/projects/$(project) && echo Running CI for $(project)... && yarn && yarn ci &&) true

ssh:
	@docker run -ti -v $(root):/app:delegated smjs bash

clean:
	@$(foreach project,$(projects),cd $(root)/projects/$(project) && echo Cleaning $(project)... && rm -rf node_modules/ &&) true