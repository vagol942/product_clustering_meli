# Mercadolibre Product Clustering

Showcase project for Mercadolibre. I present a system capable of scrapping and clustering
any products from Mercadolibre given a search query term.

The project is divided in several modules:

- common: Utilities for most of the application (in this case, the s3 integration).
- nlp: Module with the string clustering algorithm.
- scrapper: Module with the scrapper logic.
- job: Module with the Bull queue system example job.
- web: Module that exposes an example express application.
- extra: Misc files.

# Requirements

- nodejs >= 10
- redis (For powering the queue system for the job module)

## NLP

The NLP-based solution for the challenge is based on a modified JaroWinkle algorithm to give
extra weight to numerical values (This is specially useful when searching for electronics has they often
contain very specific numerical codes on their names). The clustering is archived via Affinity Propagation Clustering (APC).

## Scrapper

The Scrapper contains a simple connection pooling system based on axios (ready to connect to a proxy pool if needed)
and scrapping logic to get products and prices using cheerio.

## Job

Contains an example implementation of a data pipeline to process the scrapped data. It
uses the Bull queue system with Redis to create and schedule the example task presented. NOTE: For the
s3 upload to be succesful you have to provide both an AWS access_key and a secret_key as environmental
variables.

## Web

A simple express application exposing a single endpoint: ~/fetch_products~ and its apiDoc to showcase
the scrapper capabilities.

## Extra

Contains an example file with the results of clustering the Xiaomi products from the first 5 pages
of Mercadolibre Colombia.
