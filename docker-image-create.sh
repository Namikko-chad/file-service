#!/bin/bash
re="\"version\": \"([^\"]*)\""
while read line; do
    if [[ $line =~ $re ]]; then
        version="${BASH_REMATCH[1]}"
				break;
    fi
done < package.json
pnpm clean
pnpm test
pnpm build
docker build --pull --rm -f "Dockerfile" -t namikko/file-service:$version "." 
exit