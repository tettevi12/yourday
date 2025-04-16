async function fetchWikipediaEvents(month, day) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.events;
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
  return \`\${year}-\${month}-\${day}\`;
}

async function generateTimeline(inputDate) {
  const date = inputDate || document.getElementById("birthdate").value;
  if (!date) return alert("Please enter a date.");
  const [year, month, day] = date.split("-");
  const results = document.getElementById("results");
  results.innerHTML = "";

  const events = await fetchWikipediaEvents(parseInt(month), parseInt(day));

  events.slice(0, 5).forEach(event => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = \`
      <h3>${event.year}</h3>
      <p>${event.text}</p>
      <a href="https://en.wikipedia.org/wiki/${event.pages[0].normalizedtitle}" target="_blank">Learn more</a>
    \`;
    results.appendChild(card);
  });

  const theme = getThemeFromEvents(events);
  const reflectionCard = document.createElement("div");
  reflectionCard.className = "card";
  reflectionCard.innerHTML = \`
    <h3>Life Theme: ${theme}</h3>
    <p>Reflect: What might your presence in history symbolize?</p>
  \`;
  results.appendChild(reflectionCard);
}

function generateRandomTimeline() {
  const randomDate = getRandomDate();
  document.getElementById("birthdate").value = randomDate;
  generateTimeline(randomDate);
}

function generateAlternateYearTimeline() {
  const altYear = document.getElementById("alternateYear").value;
  const currentDate = document.getElementById("birthdate").value;
  if (!currentDate || !altYear) return alert("Please select both birthdate and alternate year.");
  const [, month, day] = currentDate.split("-");
  const altDate = \`\${altYear}-\${month}-\${day}\`;
  generateTimeline(altDate);
}
