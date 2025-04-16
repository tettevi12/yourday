
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

  events.slice(0, 5).forEach(event => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>Year: ${event.year}</h3>
      <p>${event.text}</p>
    `;
    results.appendChild(card);
  });
}

