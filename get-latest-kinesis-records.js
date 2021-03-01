const AWS = require('aws-sdk');

const getKinesisRecords = async (kinesis, shardIterator) => {
    const getRecordsParams = {
        ShardIterator: shardIterator,
    };

    let getRecordsResponse;
    try {
        getRecordsResponse = await kinesis.getRecords(getRecordsParams).promise();
    } catch (getRecordsError) {
        if (getRecordsError) {
            throw new Error(
                `getRecords request failed.
                \n params: ${JSON.stringify(getRecordsParams)}
                \n error: ${JSON.stringify(getRecordsError)}`);
        }
    }

    const retrievedEvents = getRecordsResponse.Records;
    if (retrievedEvents && retrievedEvents.length > 0) {
        const parsedRecordEventData = [];
        getRecordsResponse.Records.forEach(record => {
            parsedRecordEventData.push(JSON.parse(record.Data));
        });
        return parsedRecordEventData;
    }
};

const getShardIterator = async (kinesis, streamName, shardId, shardIteratorType = 'TRIM_HORIZON', unixTimestamp) => {
    const getShardIteratorParams = {
        StreamName: streamName,
        ShardId: shardId,
        ShardIteratorType: shardIteratorType,
    };

    if (shardIteratorType === 'AT_TIMESTAMP' && unixTimestamp) {
        getShardIteratorParams.Timestamp = unixTimestamp;
    }

    let shardIterator;
    try {
        shardIterator = await kinesis.getShardIterator(getShardIteratorParams).promise();
    } catch (getShardIteratorError) {
        throw new Error(
            `getShardIterator request failed.
            \n error: ${getShardIteratorError}`,
        );
    }

    return shardIterator;
};

const getLatestKinesisRecordsTool = async (envToQuery, minsAgoToReadFrom, streamName, shardId) => {
    console.log(`Attempting to get Kinesis stream records`);
    const defaultRegion = envToQuery === 'qa' ? 'eu-west-1' : 'us-west-2';

    const kinesis = new AWS.Kinesis({
        region: defaultRegion,
    });

    const getRecordsTimestamp = new Date();
    const defaultMinsAgoToReadFrom = minsAgoToReadFrom ? minsAgoToReadFrom : 5;
    getRecordsTimestamp.setMinutes(getRecordsTimestamp.getMinutes() - defaultMinsAgoToReadFrom);
    const unixTimestamp = getRecordsTimestamp.getTime() / 1000;

    const defaultStreamNamePrefix = streamName ? streamName : 'experiments-eventstream-'
    const streamNameSuffix = envToQuery === 'qa' ? 'qa' : 'dev';
    const fullStreamName = defaultStreamNamePrefix + streamNameSuffix;

    const defaultShardId = shardId ? shardId : 'shardId-000000000000';

    try {
        console.log(
            `Attempting to fetch events for stream: ${fullStreamName} from ${defaultMinsAgoToReadFrom} minutes ago`
        );
        const shardIterator = await getShardIterator(kinesis, fullStreamName, defaultShardId, 'AT_TIMESTAMP', unixTimestamp);

        console.info(`shardIterator is: ${JSON.stringify(shardIterator)}`);

        const latestRecords = await getKinesisRecords(kinesis, shardIterator.ShardIterator);
        console.info(`latestRecords are: ${JSON.stringify(latestRecords)}`);

        console.info(`Retrieved records`);

        return latestRecords;
    } catch (error) {
        console.info(`An error occurred: ${error}`);
        throw new Error(`getLatestKinesisRecordsTool error: ${JSON.stringify(error)}`);
    }
};

module.exports.getLatestKinesisRecordsTool = getLatestKinesisRecordsTool;
