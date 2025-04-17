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
  googleResults.slice(0, 5).forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let imageHtml = "";
    if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
      imageHtml = `<img src="${item.pagemap.cse_image[0].src}" alt="Preview" style="width:100%; max-height:180px; object-fit:cover; border-radius:8px;" />`;
    }

    card.innerHTML = `
      <h4>🔍 From the Web</h4>
      ${imageHtml}
      <h3>${item.title}</h3>
      <p>${item.snippet}</p>
      <a href="${item.link}" target="_blank">Read more</a>
    `;
    results.appendChild(card);
  });
}

function generateRandomTimeline() {
  const randomDate = getRandomDate();
  document.getElementById("birthdate").value = randomDate;
  generateTimeline(randomDate);
}
