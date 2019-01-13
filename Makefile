.PHONY: build ci
root = $(shell pwd)
projects = $(shell ls projects)

build:
	@yarn
	@$(foreach project,$(projects),cd $(root)/projects/$(project) && yarn &&) true

ci: build
	@yarn ci
	@$(foreach project,$(projects),cd $(root)/projects/$(project) && yarn ci &&) true

ssh:
	@docker run -ti -v $(root):/app smjs bash
