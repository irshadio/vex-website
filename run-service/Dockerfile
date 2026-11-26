# The run service for the playground. Build the binaries first with
# `node scripts/build-run-service.mjs --linux`, which puts them in dist/.
FROM debian:bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc libc6-dev \
 && rm -rf /var/lib/apt/lists/*
COPY dist/vex dist/run-service /usr/local/bin/
ENV VEX=/usr/local/bin/vex CC=gcc
EXPOSE 8080
CMD ["/usr/local/bin/run-service"]
