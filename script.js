async function fetchWikipediaEvents(month, day) {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.events;
}

async function generateTimeline() {
  const date = document.getElementById("birthdate").value;
  if (!date) return alert("Please enter a date.");

  const [year, month, day] = date.split("-");
  const results = document.getElementById("results");
  results.innerHTML = "";

  const events = await fetchWikipediaEvents(parseInt(month), parseInt(day));

  events.slice(0, 6).forEach(event => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${event.year}</h3>
      <h4>${event.text}</h4>
      <a href="https://en.wikipedia.org/wiki/${event.pages[0].normalizedtitle}" target="_blank">Read more</a>
    `;
    results.appendChild(card);
  });

  addShareButtons();
}

function addShareButtons() {
  const results = document.getElementById("results");
  const shareDiv = document.createElement("div");
  shareDiv.className = "share-buttons";
  shareDiv.innerHTML = `
    <h4>Share your day:</h4>
    <a href="https://twitter.com/intent/tweet?text=Look what happened on my birthday!&url=https://yourusername.github.io/yourday-explorer" target="_blank">Share on Twitter</a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://yourusername.github.io/yourday-explorer" target="_blank">Share on Facebook</a>
  `;
  results.appendChild(shareDiv);
}
