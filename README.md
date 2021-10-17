# write-through-cache

A simple write through cache for 2 dimensional data structures using redis, also be called as lsm data structure.

1. Used for providing high write throughputs.
2. Converting high speed incoming data(streams) for micro batch processing.
3. Sorts incoming data with option to bin them into batches.
4. Provides horizontal & vertical scalling with multiple shards.
5. Provides mechanism to purge data to cold storage.
6. Provides range reads.
7. Designed for micro-services enviroment.

## Built with

1. Authors :heart for Open Source.
2. [redis-scripto](https://www.npmjs.com/package/redis-scripto) for handling lua scripts.

## Contributions

1. New ideas/techniques are welcomed.
2. Raise a Pull Request.

## Current Version:
W.I.P(Not released yet)

## Pre-requisite
1. When using horizontal scalling it is very important to synchronise time between shards via NTP.

## License
This project is contrubution to public domain and completely free for use, view [LICENSE.md](/license.md) file for details.