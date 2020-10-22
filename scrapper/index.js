const axios = require("axios").default;
const cheerio = require("cheerio");
const _ = require("lodash");
const nlp = require("../nlp");
const Promise = require("bluebird");

const MELI_LISTINGS_URI = "https://listado.mercadolibre.com.co";
const CONCURRENT_REQUESTS = 1;

async function fetchProductSearchPages(query, numPages) {
  const responses = await Promise.map(
    _.range(numPages),
    (pageNumber) =>
      axios.get(
        `${MELI_LISTINGS_URI}/${spacesToDashes(query)}/_Desde_${
          50 * pageNumber + 1
        }`
      ),
    { concurrency: CONCURRENT_REQUESTS }
  );
  return responses.map((res, index) => ({
    query,
    pageNumber: index + 1,
    html: res.data,
  }));
}

function spacesToDashes(string) {
  return _.trim(string).replace(/\s+/gi, "-");
}

function scrapProductsFromHtml(html) {
  const $ = cheerio.load(html);
  const layoutWrapper = $(".ui-search-layout__item");
  // We check if the search item wrapper is present to gives of a clue
  // that the html file is well formed
  if (!layoutWrapper.length) {
    throw new Error("The html file doesn't contain any products.");
  }
  let products = [];
  layoutWrapper.map((index, item) => {
    products.push({
      title: $(item).find(".ui-search-item__title").text(),
      price: parseInt(
        $(item).find(".price-tag-fraction").first().text().replace(/\./g, "")
      ),
    });
  });
  return products;
}

async function fetchProducts(query, numPages) {
  const dumps = await fetchProductSearchPages(query, numPages);
  if (!dumps || !dumps.length) {
    throw new Error("Error fetching the html documents.")
  }
  const products = _.flatten(
    dumps.map((dump) => {
      return scrapProductsFromHtml(dump.html);
    })
  );

  return products;
}

// Works as the main entry point of the scrapper module
async function getProductsGroups(query, numPages) {
  try {
    const products = await fetchProducts(query, numPages);
    return nlp.clusterProducts(products);
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  fetchProductSearchPages,
  getProductsGroups,
};
