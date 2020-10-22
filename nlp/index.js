const natural = require("natural");
const apCluster = require("affinity-propagation");
const _ = require("lodash");

function reduceToNumerics(str) {
  return str
    .replace(/(\/)/, " ")
    .split(" ")
    .filter((word) => word.match(/\d+/) && word.length < 3)
    .join(" ");
}

function pDistance(s1, s2) {
  const jaroDelta = natural.JaroWinklerDistance(s1, s2);
  const jaroNumbersDelta = natural.JaroWinklerDistance(
    reduceToNumerics(s1),
    reduceToNumerics(s2)
  );
  return 1 * jaroDelta * 2 * jaroNumbersDelta;
}

function clusterProducts(products) {
  let scoreMatrix = [];

  for (let i = 0; i < products.length; i++) {
    let row = [];
    for (let j = 0; j < products.length; j++) {
      row.push(pDistance(products[i].title, products[j].title));
    }
    scoreMatrix.push(row);
  }
  const result = apCluster.getClusters(scoreMatrix);
  const clusters = {};
  result.exemplars.forEach((exemplar, index) => {
    clusters[index] = products.filter(
      (_str, index) => result.clusters[index] === exemplar
    );
  });
  return clusters;
}

module.exports = { clusterProducts };
