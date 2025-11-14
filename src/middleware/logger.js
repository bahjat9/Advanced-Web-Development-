// src/middleware/logger.js

export async function logMiddleware(req, res, next) {
  const date = new Date().toISOString();
  console.log(`[${date}] ${req.method} ${req.url}`);

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await response.json();

    req.data = data; // attach fetched data to request object
    console.log(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  next();
}