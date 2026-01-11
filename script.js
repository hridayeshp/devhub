// Grab elements from the page
const button = document.getElementById("searchBtn");
const input = document.getElementById("username");
const result = document.getElementById("result");

// Main function that does EVERYTHING
async function searchUser() {
  // UI: loading state
  button.disabled = true;
  button.innerText = "Loading...";
  result.innerHTML = "";

  const username = input.value.trim();

  // Empty input check
  if (username === "") {
    result.innerHTML = "<p>Please enter a username ⚠️</p>";
    button.disabled = false;
    button.innerText = "Search";
    return;
  }

  try {
    // Fetch user data
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      result.innerHTML = "<p>User not found ❌</p>";
      button.disabled = false;
      button.innerText = "Search";
      return;
    }

    const data = await response.json();

    // Fetch repos
    const repoResponse = await fetch(data.repos_url);
    const repos = await repoResponse.json();

    // Sort repos by stars and take top 5
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    // Render result
    result.innerHTML = `
      <div class="card">
        <img src="${data.avatar_url}" />
        <h2>${data.name ?? data.login}</h2>
        <p>${data.bio ?? "No bio available"}</p>
        <p>👥 ${data.followers} followers · ${data.following} following</p>

        <h3>⭐ Top Repositories</h3>
        <ul>
          ${topRepos
            .map(
              repo => `
                <li>
                  <a href="${repo.html_url}" target="_blank">
                    ${repo.name}
                  </a>
                  ⭐ ${repo.stargazers_count}
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    `;
  } catch (error) {
    result.innerHTML = "<p>Something went wrong 😵</p>";
  }

  // UI: reset button
  button.disabled = false;
  button.innerText = "Search";
}

// Button click
button.addEventListener("click", searchUser);

// Enter key support
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchUser();
  }
});
