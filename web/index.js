const express = require("express");
const scrapper = require("../scrapper");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

/**
 * @api {post} /fetch_products Request Products from the scrapper
 * @apiName FetchProducts
 * @apiGroup Products
 *
 * @apiParam {String} query Search query.
 * @apiParam {Number} numPages amount of pages to scrap (articles per page: 50).
 */
app.post("/fetch_products", async (req, res, next) => {
  const searchQuery = req.body.query;
  const numPages = req.body.numPages || 5;
  if (!searchQuery) {
    next(new Error("The query must be defined!"));
  }
  res.json(await scrapper.getProductsGroups(searchQuery, numPages));
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
