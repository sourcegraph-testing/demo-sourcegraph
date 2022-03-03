#!/usr/bin/env bash

set -ex

export GO111MODULE=on

# Disable proxy since it can cache the value of master
export GOPROXY="${GOPROXY:-direct}"

# Can specify a SHA pushed to our fork instead of master
version="${1:-master}"

upstream=github.com/google/zoekt
fork=github.com/sourcegraph/zoekt

oldsha="$(go mod edit -print | grep "$fork" | grep -o '[a-f0-9]*$')"
go get -v "${fork}@${version}"
newsha="$(echo "$module" | grep -o '[a-f0-9]*$')"

# echo "https://github.com/sourcegraph/zoekt/compare/$oldsha...$newsha"
# echo "git log --pretty=format:'- https://github.com/sourcegraph/zoekt/commit/%h %s' $oldsha...$newsha | sed 's/ (#[0-9]*)//g'"
# echo "git log --pretty=format:'- %h %s' $oldsha...$newsha | sed 's/ (#[0-9]*)//g'"

# go mod edit "-replace=${upstream}=${module}"
# go mod download ${upstream}
# go mod tidy

# echo "Ensure we update go.sum by actually compiling some code which depends on zoekt."
# echo "We do this by running 'go test' without actually running any tests."
# go test -run '^$' github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend
