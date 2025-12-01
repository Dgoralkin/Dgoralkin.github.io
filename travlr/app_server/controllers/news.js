/* ========================================================================================
  File: news.js
  Description: Controller module for the News page.
  Author: Daniel Gorelkin
  Version: 1.1
  Created: 2025-08-15
  Updated: 2025-11-10

  Purpose:
    - This is the controller module to add navigation functionality for the news 
      page which manage the application logic
    - Read the articles from the database @travlr.news collection and store data as array.
    - Fetch data from the database through an API endpoint with a fallback option.
=========================================================================================== */

// Build an API URL from environment variable (fallback to localhost) and the /api path.
const apiHost = process.env.API_HOST;
const newsEndpoint = `${apiHost}/api/news`;

const options = {
  method: "GET",
  headers: { Accept: "application/json" }
};

// Controller function to handle requests to the news page
const news = async (req, res, next) => {

  try {
    // Make a GET request to the API endpoint to fetch news
    const response = await fetch(newsEndpoint, options);

    // Throw an error if the response has a bad status (404 or 500)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    // Parse the JSON response to get the articles array
    let allNews = await response.json();

    // Handle cases where no articles are found or unexpected data is returned
    let message = null;
    if (!Array.isArray(allNews)) {
      console.error("API returned unexpected data");
      message = "API lookup error";
      allNews = [];
    } else if (allNews.length === 0) {
      message = "No trips were found in our database.";
    }

    // Render the news view with the fetched articles and any message (Response 200 OK)
    res.render("news", {
      title: "News - Travlr Getaways",
      currentPage: "news",
      news_data: allNews[0],
      message
    });
  } catch (err) {
    // Handle any errors that occur during the fetch operation
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = { news };