const getLatestKinesisEventsTool = require('./get-latest-kinesis-records.js');

// Arguments: 1) 'qa' or 'dev' env 2) Number of minutes ago from which to read events 3) Non default name for stream: `website-eventstream-dev`
const getLatestKinesisEventsToolRunner = async () => {
    const result = await getLatestKinesisEventsTool.getLatestKinesisRecordsTool(process.argv[2], process.argv[3], process.argv[4]);
    console.log(result);
    return result;
};

getLatestKinesisEventsToolRunner();
