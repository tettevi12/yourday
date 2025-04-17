async function fetchWikipediaEvents(month, day) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.events;
}

async function fetchGoogleSearch(query) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_API_KEY}&cx=${CONFIG.GOOGLE_CX}&q=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items || [];
}

function getRandomDate() {
  const year = Math.floor(Math.random() * 40) + 1980;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function generateTimeline(inputDate) {
  const date = inputDate || document.getElementById("birthdate").value;
  if (!date) return alert("Please enter a date.");
  const [year, month, day] = date.split("-");
  const results = document.getElementById("results");
  results.innerHTML = "";

  const events = await fetchWikipediaEvents(parseInt(month), parseInt(day));
  const matchedEvents = events.filter(e => e.year == year);
  const otherEvents = events.filter(e => e.year != year);
  const timelineEvents = [...matchedEvents, ...otherEvents.slice(0, 5 - matchedEvents.length)];

  if (matchedEvents.length === 0) {
    const info = document.createElement("div");
    info.className = "card";
    info.innerHTML = `<p>No major recorded events found for your birth year. Here's what else happened on this day:</p>`;
    results.appendChild(info);
  }

  timelineEvents.forEach(event => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${event.year}</h3>
      <p>${event.text}</p>
      <a href="https://en.wikipedia.org/wiki/${event.pages[0].normalizedtitle}" target="_blank">Learn more</a>
    `;
    results.appendChild(card);
  });

  const googleResults = await fetchGoogleSearch(`events on ${month}/${day}/${year}`);
  if (googleResults.length > 0) {
    const googleCard = document.createElement("div");
    googleCard.className = "card";
    googleCard.innerHTML = "<h3>🔎 Google Search Results</h3>" + googleResults.slice(0, 3).map(item =>
      `<p><a href="${item.link}" target="_blank">${item.title}</a></p>`
    ).join("");
    results.appendChild(googleCard);
  }
}

function generateRandomTimeline() {
  const randomDate = getRandomDate();
  document.getElementById("birthdate").value = randomDate;
  generateTimeline(randomDate);
}
