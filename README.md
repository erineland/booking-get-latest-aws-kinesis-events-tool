# get-recent-aws-kinesis-event-stream-events-tool
A small tool to conveniently make the series of 3 or 4 requests required to retrieve and format the latest events in a given AWS Kinesis stream.

You can supply the Kinesis stream name, Shard ID and a number of minutes from which to start reading Kinesis events in the given stream from.

Has some defaults that are useful and specific to myself. 

To use the tool run the command `node get-latest-kinesis-records-runner.js 'dev'
