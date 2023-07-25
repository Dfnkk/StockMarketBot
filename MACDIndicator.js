// Replace 'YOUR_API_KEY' with your Alpha Vantage API key
const apiKey = 'YOUR_API_KEY';
const stockSymbol = 'AAPL'; // Replace with the desired stock symbol
const shortMA = 50; // Short-term moving average (days)
const longMA = 200; // Long-term moving average (days)

// Function to fetch stock data from Alpha Vantage API
async function fetchStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data['Time Series (Daily)'];
}

// Function to calculate moving averages
function calculateMovingAverage(data, period) {
  const prices = Object.values(data).map((entry) => parseFloat(entry['4. close']));
  const totalPrices = prices.reduce((sum, price) => sum + price, 0);
  return totalPrices / period;
}

// Main function to generate buy and sell signals
async function generateSignals() {
  try {
    const stockData = await fetchStockData(stockSymbol);

    // Convert the dates to timestamps for better sorting
    const sortedDates = Object.keys(stockData).sort((a, b) => new Date(a) - new Date(b));

    const shortMAGenerate = sortedDates.slice(-shortMA);
    const longMAGenerate = sortedDates.slice(-longMA);

    const shortMAData = shortMAGenerate.reduce((obj, date) => {
      obj[date] = stockData[date];
      return obj;
    }, {});
    const longMAData = longMAGenerate.reduce((obj, date) => {
      obj[date] = stockData[date];
      return obj;
    }, {});

    const shortMAValue = calculateMovingAverage(shortMAData, shortMA);
    const longMAValue = calculateMovingAverage(longMAData, longMA);

    if (shortMAValue > longMAValue) {
      console.log('Buy signal');
    } else if (shortMAValue < longMAValue) {
      console.log('Sell signal');
    } else {
      console.log('No signal');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the main function to generate signals
generateSignals();
