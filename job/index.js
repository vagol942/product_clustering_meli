const Queue = require("bull");
const scrapper = require("../scrapper");
const { S3Client } = require("../common/s3Client");

// Every 15 minutes
const cronString = "*/15 * * * *";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const BUCKET_NAME = "html_dumps";

const s3Client = new S3Client(ACCESS_KEY, SECRET_ACCESS_KEY);

function createScrappingQueue() {
  try {
    const scrappingQueue = new Queue("scrapping queue", REDIS_URL);

    // Adds to the scrapping pipeline s3 upload.
    scrappingQueue.process(async function (job) {
      dumps = scrapper.fetchProductSearchPages(queryTerm, numPages);
      dumps.map((dump) => {
        s3Client.put(
          s3Client.createHtmlPutRequest(
            BUCKET_NAME,
            `${dump.query}-${Date.now()}-${dump.pageNumber}.html`,
            dump.html
          )
        );
      });
      return scrapper.getProductsGroups();
    });
    // Registers the queue to execute every
    scrappingQueue.add({}, { repeat: { cron: cronString } });
  } catch (e) {
    console.error(e);
  }
}

// Start the job
createScrappingQueue();
