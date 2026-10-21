(() => {
  const navButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', () => {
      const expanded = navButton.getAttribute('aria-expanded') === 'true';
      navButton.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        navButton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealItems = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    try {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
      document.body.classList.add('motion-enabled');
      revealItems.forEach(item => revealObserver.observe(item));
    } catch (error) {
      revealObserver = null;
      document.body.classList.remove('motion-enabled');
      revealItems.forEach(item => item.classList.add('is-visible'));
    }
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const glow = document.querySelector('.cursor-glow');
  if (finePointer.matches && glow && !reducedMotion) {
    document.body.classList.add('has-mouse');
    window.addEventListener('pointermove', event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const repositoryGrid = document.querySelector('#repository-grid');
  const repositoryStatus = document.querySelector('#repo-status');
  const repositoryControls = document.querySelector('#repo-controls');
  const repositoryError = document.querySelector('#repo-error');
  const repositoryErrorMessage = document.querySelector('#repo-error-message');
  const repositorySearch = document.querySelector('#repo-search');
  const repositoryLanguage = document.querySelector('#repo-language');
  const repositoryRetry = document.querySelector('#repo-retry');

  if (repositoryGrid && repositoryStatus && repositoryControls && repositoryError && repositorySearch && repositoryLanguage && repositoryRetry) {
    const apiUrl = 'https://api.github.com/users/mogambikim/repos?sort=updated&per_page=100';
    let repositories = [];

    const makeElement = (tag, className, value) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (value !== undefined) element.textContent = value;
      return element;
    };

    const observeReveal = element => {
      if (reducedMotion || !revealObserver) element.classList.add('is-visible');
      else revealObserver.observe(element);
    };

    const createRepositoryCard = (repository, index) => {
      const card = makeElement('article', 'project-card repo-card reveal');
      const artClass = index % 2 === 0 ? 'art-one' : 'art-two';
      const art = makeElement('div', `project-art ${artClass}`);
      art.setAttribute('aria-hidden', 'true');
      if (index % 2 === 0) {
        art.append(makeElement('span', 'art-orbit'), makeElement('span', 'art-square'), makeElement('span', 'art-code mono', 'GITHUB\nREPOSITORY'));
      } else {
        art.append(makeElement('span', 'art-signal signal-a'), makeElement('span', 'art-signal signal-b'), makeElement('span', 'art-node'), makeElement('span', 'art-node node-two'), makeElement('span', 'art-cross', '+'));
      }

      const info = makeElement('div', 'project-info');
      const indexLine = makeElement('p', 'project-index mono', 'PUBLIC REPOSITORY');
      if (repository.fork) indexLine.append(makeElement('span', 'repo-fork-label mono', ' · FORK'));
      const heading = makeElement('h3', '', repository.name || 'Unnamed repository');
      const description = makeElement('p', 'repo-description', repository.description || 'No description provided on GitHub.');
      const meta = makeElement('div', 'repo-meta');
      meta.append(makeElement('span', 'repo-language', repository.language || 'Language not specified'));
      meta.append(makeElement('span', 'repo-stars', `★ ${Number(repository.stargazers_count || 0).toLocaleString()} stars`));

      const updatedDate = new Date(repository.updated_at);
      const dateValue = Number.isNaN(updatedDate.getTime()) ? '' : updatedDate.toISOString();
      const formattedDate = dateValue
        ? new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(updatedDate)
        : 'Date unavailable';
      const updated = makeElement('p', 'repo-updated');
      updated.append(document.createTextNode('Updated '));
      const time = makeElement('time', '', formattedDate);
      if (dateValue) time.dateTime = dateValue;
      updated.append(time);

      const repositoryUrl = new URL(repository.html_url);
      if (repositoryUrl.protocol !== 'https:' || repositoryUrl.hostname !== 'github.com' || !repositoryUrl.pathname.startsWith('/mogambikim/')) return null;
      const action = makeElement('a', 'project-action repo-action', 'View on GitHub ↗');
      action.href = repositoryUrl.href;
      action.target = '_blank';
      action.rel = 'noopener noreferrer';
      info.append(indexLine, heading, description, meta, updated, action);
      card.append(art, info);
      observeReveal(card);
      return card;
    };

    const renderRepositories = () => {
      const searchTerm = repositorySearch.value.trim().toLocaleLowerCase();
      const language = repositoryLanguage.value;
      const filtered = repositories.filter(repository => {
        const searchable = `${repository.name} ${repository.description || ''}`.toLocaleLowerCase();
        return (!searchTerm || searchable.includes(searchTerm)) && (!language || repository.language === language);
      });

      repositoryGrid.replaceChildren();
      filtered.forEach((repository, index) => {
        const card = createRepositoryCard(repository, index);
        if (card) repositoryGrid.append(card);
      });

      const shown = repositoryGrid.childElementCount;
      repositoryStatus.hidden = false;
      repositoryStatus.classList.remove('is-loading');
      repositoryStatus.textContent = shown
        ? `Showing ${shown} of ${repositories.length} public repositories.`
        : 'No repositories match these filters.';
    };

    const setLoadError = error => {
      repositoryStatus.hidden = true;
      repositoryControls.hidden = true;
      repositoryGrid.replaceChildren();
      repositoryError.hidden = false;
      repositoryErrorMessage.textContent = error.message;
    };

    const loadRepositories = async () => {
      repositoryRetry.disabled = true;
      repositoryError.hidden = true;
      repositoryControls.hidden = true;
      repositoryGrid.replaceChildren();
      repositoryStatus.hidden = false;
      repositoryStatus.classList.add('is-loading');
      repositoryStatus.innerHTML = '<span class="repo-spinner" aria-hidden="true"></span> Loading public repositories…';

      try {
        const response = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } });
        if (!response.ok) {
          const rateLimited = response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
          throw new Error(rateLimited
            ? 'GitHub is temporarily limiting public API requests. Please wait a little and try again.'
            : 'GitHub repositories could not be loaded. Check your connection and try again.');
        }

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('GitHub returned an unexpected response. Please try again.');

        repositories = data
          .filter(repository => repository && !repository.archived && repository.html_url)
          .sort((a, b) => Date.parse(b.updated_at || '') - Date.parse(a.updated_at || ''));

        const languages = [...new Set(repositories.map(repository => repository.language).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b));
        repositoryLanguage.replaceChildren(new Option('All languages', ''));
        languages.forEach(language => repositoryLanguage.add(new Option(language, language)));
        repositoryControls.hidden = repositories.length === 0;
        repositoryError.hidden = true;

        if (repositories.length === 0) {
          repositoryStatus.classList.remove('is-loading');
          repositoryStatus.textContent = 'No public repositories are available right now.';
          return;
        }

        renderRepositories();
      } catch (error) {
        setLoadError(error instanceof TypeError
          ? new Error('GitHub could not be reached. Check your connection, or visit the profile directly.')
          : error);
      } finally {
        repositoryRetry.disabled = false;
      }
    };

    repositorySearch.addEventListener('input', renderRepositories);
    repositoryLanguage.addEventListener('change', renderRepositories);
    repositoryRetry.addEventListener('click', loadRepositories);
    loadRepositories();
  }
})();
