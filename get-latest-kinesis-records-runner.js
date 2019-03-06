const getLatestKinesisEventsTool = require('./get-latest-kinesis-records.js');

// Arguments: 1) 'qa' or 'dev' env 2) Number of minutes ago from which to read events
const getLatestKinesisEventsToolRunner = async () => {
    const result = await getLatestKinesisEventsTool.getLatestKinesisRecordsTool(process.argv[2], process.argv[3]);
    console.log(result);
    return result;
};

getLatestKinesisEventsToolRunner();
