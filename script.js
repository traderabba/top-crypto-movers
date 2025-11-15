document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "block";
    try {
        // Fetch first 3 pages in parallel
        const pages = [1,2,3];
        const responses = await Promise.all(
            pages.map(page => fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&price_change_percentage=24h`).then(r => r.json()))
        );
        const allCoins = responses.flat();
        const coinsWithChange = allCoins.filter(c => c.price_change_percentage_24h != null);

        const topGainers = coinsWithChange.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0,20);
        const topLosers = coinsWithChange.sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0,20);

        renderBubbles(topGainers, "gainers", "gainer-percent");
        renderBubbles(topLosers, "losers", "loser-percent");

    } catch (err) {
        console.error(err);
        alert("Error fetching data from CoinGecko");
    } finally {
        loadingDiv.style.display = "none";
    }
}

function renderBubbles(coins, containerId, percentClass) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    coins.forEach(c => {
        container.innerHTML += `<div class="bubble">
            <img src="${c.image}" alt="${c.symbol.toUpperCase()}">
            <div class="symbol">${c.symbol.toUpperCase()}</div>
            <div class="percent ${percentClass}">${c.price_change_percentage_24h.toFixed(2)}%</div>
        </div>`;
    });
}