pnpm clean
pnpm test
pnpm build
docker build --pull --rm -f "Dockerfile" -t fileservice:latest "." 