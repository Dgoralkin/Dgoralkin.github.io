/* ========================================================================================
  File: news_api.js
  Description: Controller for news-related API endpoints.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-12

  Purpose:
    - This file contains controller methods for handling API requests related to the news collection.
    - It includes methods for retrieving, news from the news collection.
    - Each method interacts with the Mongoose model to perform database operations.
    - Proper error handling and response formatting are implemented.
=========================================================================================== */

// Import the Mongoose model for index collection
const DB_News = require('../models/newsSchema');

// ======================================== //
//          *** Methods for GET ***         //
// ======================================== //

// GET: /news -> Endpoint lists all news from DB.news collection.
// Returns JSON array of all news.
const allNewsList = async (req, res) => {
    try {
        // Query the DB with get all
        const query = await DB_News.find({}).lean().exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// GET: /news:latest_news -> Endpoint lists all latest_news from DB.news collection.
// E.g., /news/latest_news
// Returns JSON object of latest_news.
const findLatestNews = async (req, res) => {
    try {
        // Query the DB with get all latest_news field only
        // 'latest_news' is an array field within the news document
        const query = await DB_News.find({}, { latest_news: 1, _id: 0 }).lean().exec();

        // If no results found, still return 200 but with a response message
        if (!query || query.length === 0) {
            return res.status(200).json({ message: "No results found" });
        }
        // Otherwise, return 200 OK and a json result
        return res.status(200).json(query[0]);

    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(404).json({ message: "Server error", error: err });
    }
};

// GET: /news/latest_news/:title -> Endpoint lists selected latest_news article from DB.news collection.
// E.g., /news/latest_news/2023 Best Beaches Contest Winners
// Returns JSON object of a single latest_news article.
const findLatestNewsArticle = async (req, res) => {
    try {
        const { title } = req.params;

        // Find one doc where latest_news has the requested title
        const result = await DB_News.find(
            { "latest_news.title": title },
            { "latest_news.$": 1, _id: 0 }
            ).lean().exec();

        // Check if we found the article, if not return 404
        if (!result || result[0] === undefined || !result[0].latest_news || result[0].latest_news.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Send back the one matching news item
        res.json(result[0].latest_news[0]);
    } catch (err) {
        console.error("Error retrieving article:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET: /news/vacation_tips -> Endpoint lists selected vacation_tips article from DB.news collection.
// Returns JSON object of all vacation_tips.
const findVacationTips = async (req, res) => {
    try {

        // Query the DB with get all vacation_tips field only
        // 'vacation_tips' is an array field within the news document
        const result = await DB_News.find({}, {vacation_tips: 1, _id: 0}).lean().exec();

        // Check if we found the articles, if not return 404
        if (!result || !result[0].vacation_tips || result[0].vacation_tips.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Send back the one matching news item
        res.json(result[0]);
    } catch (err) {
        console.error("Error retrieving article:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET: /news/vacation_tips/:title -> Endpoint lists selected vacation_tips article from DB.news collection.
// E.g., /news/vacation_tips/First Aid
// Returns JSON object of a single vacation_tips article.
const findVacationTipsArticle = async (req, res) => {
    try {
        const { title } = req.params;

        // Find one doc where vacation_tips has the requested title
        const result = await DB_News.findOne(
            { "vacation_tips.title": title },
            { "vacation_tips.$": 1, _id: 0 }
            ).lean().exec();

        // Check if we found the article, if not return 404
        if (!result || !result.vacation_tips || result.vacation_tips.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Send back the one matching news item
        res.json(result.vacation_tips[0]);
    } catch (err) {
        console.error("Error retrieving article:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Export the controller methods
module.exports = {
    allNewsList,
    findLatestNews,
    findLatestNewsArticle,
    findVacationTips,
    findVacationTipsArticle
};