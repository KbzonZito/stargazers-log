const repoList = document.getElementById('starred-repositories');

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderRepos(repositories) {
  if (!repositories.length) {
    repoList.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
    return;
  }

  repoList.innerHTML = repositories
    .map((repo) => {
      const languageClass = repo.language ? repo.language.toLowerCase() : 'unknown';
      const stars = repo.stargazers_count.toLocaleString();

      return `
        <li class="repo-item">
          <div class="repo-main">
            <h3 class="repo-name">
              <a href="https://github.com/${repo.full_name}" target="_blank" rel="noreferrer">
                ${repo.full_name}
              </a>
            </h3>
            <p class="repo-description">${repo.description || 'No description provided.'}</p>
          </div>
          <div class="repo-meta">
            <span><span class="language-dot" aria-hidden="true"></span> ${repo.language || 'Unknown'}</span>
            <span class="repo-stars">★ ${stars}</span>
            <span>Updated ${formatDate(repo.updated_at)}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

async function loadRepositories() {
  repoList.innerHTML = '<li class="loading">Loading starred repositories…</li>';

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    renderRepos(repositories);
  } catch (error) {
    repoList.innerHTML = '<li class="empty-state">Unable to load starred repositories right now.</li>';
    console.error('Error loading repositories:', error);
  }
}

loadRepositories();
