async function fetchWikipediaEvents(month, day) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.events;
}
async function fetchNews(date) {
  const url = `https://newsapi.org/v2/everything?q=birthday&from=${date}&to=${date}&sortBy=popularity&apiKey=${CONFIG.NEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.articles || [];
}
async function fetchNasaImage(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
async function fetchQuote() {
  const res = await fetch("https://api.quotable.io/random?tags=wisdom|inspirational");
  const data = await res.json();
  return `${data.content} — ${data.author}`;
}
async function fetchKanyeQuote() {
  const res = await fetch("https://api.kanye.rest");
  const data = await res.json();
  return data.quote;
}
async function fetchAdvice() {
  const res = await fetch("https://api.adviceslip.com/advice");
  const data = await res.json();
  return data.slip.advice;
}
function getThemeFromEvents(events) {
  const keywords = events.map(e => e.text.toLowerCase());
  if (keywords.some(text => text.includes("peace") || text.includes("treaty"))) return "Peacemaker";
  if (keywords.some(text => text.includes("science") || text.includes("discovery"))) return "Innovator";
  if (keywords.some(text => text.includes("war") || text.includes("conflict"))) return "Warrior Spirit";
  return "Time Traveler";
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

  const news = await fetchNews(date);
  if (news.length > 0) {
    const newsCard = document.createElement("div");
    newsCard.className = "card";
    newsCard.innerHTML = `<h3>Top News on Your Birthday</h3>` + news.slice(0, 3).map(n =>
      `<p><a href="${n.url}" target="_blank">${n.title}</a></p>`
    ).join("");
    results.appendChild(newsCard);
  }

  const nasaImg = await fetchNasaImage(date);
  const nasaCard = document.createElement("div");
  nasaCard.className = "card";
  nasaCard.innerHTML = `
    <h3>Astronomy Picture on Your Birthday</h3>
    <img src="${nasaImg.url}" alt="NASA Image" style="width:100%; border-radius:10px;" />
    <p>${nasaImg.title}</p>
  `;
  results.appendChild(nasaCard);

  const quote = await fetchQuote();
  const quoteCard = document.createElement("div");
  quoteCard.className = "card";
  quoteCard.innerHTML = `<h3>Inspirational Quote</h3><p>${quote}</p>`;
  results.appendChild(quoteCard);

  const kanye = await fetchKanyeQuote();
  const kanyeCard = document.createElement("div");
  kanyeCard.className = "card";
  kanyeCard.innerHTML = `<h3>Kanye Quote</h3><p>"${kanye}"</p>`;
  results.appendChild(kanyeCard);

  const advice = await fetchAdvice();
  const adviceCard = document.createElement("div");
  adviceCard.className = "card";
  adviceCard.innerHTML = `<h3>Birthday Advice</h3><p>"${advice}"</p>`;
  results.appendChild(adviceCard);

  const theme = getThemeFromEvents(events);
  const themeCard = document.createElement("div");
  themeCard.className = "card";
  themeCard.innerHTML = `<h3>Life Theme: ${theme}</h3><p>What might your presence in history symbolize?</p>`;
  results.appendChild(themeCard);
}
function generateRandomTimeline() {
  const randomDate = getRandomDate();
  document.getElementById("birthdate").value = randomDate;
  generateTimeline(randomDate);
}
