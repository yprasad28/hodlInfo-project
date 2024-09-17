fetch('http://localhost:5501/api/tickers')
    .then(response => response.json())
    .then(data => {
      const tickersList = document.getElementById('tickers');
      data.forEach(ticker => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ticker.name} - Last: ${ticker.last}, Buy: ${ticker.buy}, Sell: ${ticker.sell}, Volume: ${ticker.volume}, Base Unit: ${ticker.base_unit}`;
        tickersList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error(error);
    });