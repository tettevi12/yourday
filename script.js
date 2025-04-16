function generateTimeline() {
  const date = document.getElementById("birthdate").value;
  const [year, month, day] = date.split("-");
  const results = document.getElementById("results");
  results.innerHTML = "";

  if (!date) {
    alert("Please enter a date.");
    return;
  }

  const sampleData = [
    { category: "News", title: "Global Peace Treaty Signed", year: year, description: `On this day in ${year}, a major treaty was signed.` },
    { category: "Pop Culture", title: "Top Album Released", year: 2004, description: "A groundbreaking album hit the charts." },
    { category: "Tech", title: "New Smartphone Launched", year: 2011, description: "A major leap in mobile technology." },
    { category: "Historical", title: "First Moon Base Announced", year: 1980, description: "A vision of the future was born." }
  ];

  sampleData.forEach(event => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${event.category} (${event.year})</h3>
      <h4>${event.title}</h4>
      <p>${event.description}</p>
    `;
    results.appendChild(card);
  });
}