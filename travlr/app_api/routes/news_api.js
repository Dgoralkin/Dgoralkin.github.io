/* ======================================================================================================
  File: news_api.js
  Description: Route module for the News page API.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-11

  Purpose:
    - This file routes the process to the news_api.js controller in app_api directory.
    - Defines the endpoint `/news` to get all the news articles.
    - Defines the endpoint `/news/latest_news` to get all the latest_news articles.
    - Defines the endpoint `/news/latest_news/title` to get a specific latest_news article by title.
    - Defines the endpoint `/news/vacation_tips` to get all vacation_tips articles.
    - Defines the endpoint `/news/vacation_tips/title` to get a specific vacation_tips article by title.
========================================================================================================= */

// Import express module and create a router object
const express = require("express");
const router = express.Router();

// Define the path for the news page api
const newsController = require("../controllers/news_api");

// GET all news articles
router.route("/news").get(newsController.allNewsList);

// GET latest news category listing
router.route("/news/latest_news").get(newsController.findLatestNews);

// GET a specific latest news article by title
router.route("/news/latest_news/:title").get(newsController.findLatestNewsArticle);

// GET vacation tips category listing
router.route("/news/vacation_tips").get(newsController.findVacationTips);

// GET specific vacation tip article by title
router.route("/news/vacation_tips/:title").get(newsController.findVacationTipsArticle);

module.exports = router;