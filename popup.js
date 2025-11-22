let professors = [];

// Load and flatten the nested array of evaluations on popup load
fetch(chrome.runtime.getURL('data.json'))
  .then(response => response.json())
  .then(data => {
    professors = data.flat(); // flatten one level since data is array of arrays
    console.log('Data loaded:', professors);
  })
  .catch(error => {
    console.error('Failed to load JSON:', error);
  });

// Main search function
function searchProfessor(query) {
  const resultsDiv = document.getElementById('results');
  if (!query) {
    resultsDiv.textContent = 'Please enter a professor name.';
    return;
  }

  const lowerQuery = query.toLowerCase().trim();

  // Exact match filtering
  const matches = professors.filter(p => 
    p.professor && p.professor.trim().toLowerCase() === lowerQuery
  );

  if (matches.length === 0) {
    resultsDiv.textContent = 'No professor found.';
    return;
  }

  // Calculate averages
  const avgQuality = (matches.reduce((sum, p) => sum + parseFloat(p.Quality), 0) / matches.length).toFixed(2);
  const avgDifficulty = (matches.reduce((sum, p) => sum + parseFloat(p.Difficulty), 0) / matches.length).toFixed(2);

  const wouldTakeAgainSum = matches.reduce((sum, p) => {
    const val = p["Would Take Again"];
    return sum + (typeof val === "string" && val.toLowerCase() === "yes" ? 1 : 0);
  }, 0);

  const avgWouldTakeAgainPercent = ((wouldTakeAgainSum / matches.length) * 100).toFixed(0);

  resultsDiv.innerHTML = `
    <h3>${matches[0].professor.trim()}</h3>
    <p><strong>Average Quality:</strong> ${avgQuality} / 5</p>
    <p><strong>Average Difficulty:</strong> ${avgDifficulty} / 5</p>
    <p><strong>Would Take Again:</strong> ${avgWouldTakeAgainPercent}%</p>
    <p><em>Based on ${matches.length} evaluations.</em></p>
  `;
}

// Attach search button listener
document.getElementById('searchBtn').addEventListener('click', () => {
  if(professors.length === 0){
    alert('Data is still loading, please wait...');
    return;
  }
  const query = document.getElementById('professorName').value.trim();
  searchProfessor(query);
});
