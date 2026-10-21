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

  const validWhatsAppUrl = (value, kind) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim());
      if (url.protocol !== 'https:') return null;
      if (kind === 'group' && url.hostname === 'chat.whatsapp.com' && url.pathname.length > 1) return url.href;
      if (kind === 'contact' && url.hostname === 'wa.me' && /^\/[0-9]{8,15}\/?$/.test(url.pathname)) return url.href;
      if (kind === 'contact' && url.hostname === 'api.whatsapp.com' && url.pathname === '/send' && /^[0-9]{8,15}$/.test(url.searchParams.get('phone') || '')) return url.href;
    } catch (error) {
      return null;
    }
    return null;
  };

  const whatsappConfig = window.AMBROSE_PORTFOLIO_CONFIG || {};
  const whatsappGroupUrl = validWhatsAppUrl(whatsappConfig.whatsappGroupUrl, 'group');
  const whatsappContactUrl = validWhatsAppUrl(whatsappConfig.whatsappContactUrl, 'contact');
  const enableConfiguredWhatsAppLink = (id, placeholderId, href) => {
    const link = document.querySelector(`#${id}`);
    const placeholder = document.querySelector(`#${placeholderId}`);
    if (!link || !placeholder || !href) return;
    link.href = href;
    link.hidden = false;
    placeholder.hidden = true;
  };
  enableConfiguredWhatsAppLink('whatsapp-group-link', 'whatsapp-group-placeholder', whatsappGroupUrl);
  enableConfiguredWhatsAppLink('whatsapp-contact-link', 'whatsapp-contact-placeholder', whatsappContactUrl);
  const whatsappFloat = document.querySelector('#whatsapp-float');
  if (whatsappFloat && whatsappContactUrl) {
    whatsappFloat.href = whatsappContactUrl;
    whatsappFloat.target = '_blank';
    whatsappFloat.rel = 'noopener noreferrer';
    whatsappFloat.setAttribute('aria-label', 'Hire Ambrose on WhatsApp');
    whatsappFloat.classList.add('is-configured');
  }

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

  const headlineVisual = document.querySelector('.headline-rotation-visual');
  const headlineAccessible = document.querySelector('#headline-rotation-accessible');
  const heroCopy = document.querySelector('.hero-copy');
  if (headlineVisual && headlineAccessible) {
    const phrases = ['Software Development', 'IT Support & Networking', 'Video Editing & Color Grading', 'Graphic Design & Branding', 'Data & Technology'];
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let phraseIndex = 0;
    let headlineTimer = null;
    let headlineTransitionTimer = null;

    const showHeadlinePhrase = (index, animate = true) => {
      if (headlineTransitionTimer) window.clearTimeout(headlineTransitionTimer);
      phraseIndex = index;
      const update = () => {
        headlineVisual.textContent = phrases[phraseIndex];
        headlineAccessible.textContent = phrases[phraseIndex];
        headlineVisual.classList.remove('is-entering');
        if (animate && !motionPreference.matches) {
          headlineVisual.classList.add('is-entering');
          requestAnimationFrame(() => requestAnimationFrame(() => headlineVisual.classList.remove('is-entering')));
        }
      };

      if (animate && !motionPreference.matches) {
        headlineVisual.classList.add('is-exiting');
        headlineTransitionTimer = window.setTimeout(() => {
          headlineTransitionTimer = null;
          headlineVisual.classList.remove('is-exiting');
          update();
        }, 320);
      } else update();
    };

    const stopHeadline = () => {
      if (headlineTimer) window.clearInterval(headlineTimer);
      headlineTimer = null;
    };
    const startHeadline = () => {
      stopHeadline();
      if (motionPreference.matches || document.hidden) return;
      headlineTimer = window.setInterval(() => showHeadlinePhrase((phraseIndex + 1) % phrases.length), 5800);
    };

    if (heroCopy) {
      heroCopy.addEventListener('mouseenter', stopHeadline);
      heroCopy.addEventListener('mouseleave', startHeadline);
      heroCopy.addEventListener('focusin', stopHeadline);
      heroCopy.addEventListener('focusout', event => {
        if (!heroCopy.contains(event.relatedTarget)) startHeadline();
      });
    }
    document.addEventListener('visibilitychange', startHeadline);
    motionPreference.addEventListener('change', event => {
      if (event.matches) {
        stopHeadline();
        showHeadlinePhrase(0, false);
      } else startHeadline();
    });
    startHeadline();
  }

  const galleryFilters = document.querySelectorAll('[data-gallery-filter]');
  const galleryCards = document.querySelectorAll('[data-gallery-category]');
  const galleryStatus = document.querySelector('#gallery-status');
  const softwareGalleryNote = document.querySelector('#software-gallery-note');
  if (galleryFilters.length && galleryStatus) {
    galleryFilters.forEach(filterButton => {
      filterButton.addEventListener('click', () => {
        const category = filterButton.dataset.galleryFilter;
        let visibleCount = 0;
        galleryFilters.forEach(button => {
          const selected = button === filterButton;
          button.classList.toggle('is-active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
        galleryCards.forEach(card => {
          const visible = category !== 'software' && (category === 'all' || card.dataset.galleryCategory === category);
          card.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        if (softwareGalleryNote) softwareGalleryNote.hidden = category !== 'software';
        galleryStatus.textContent = category === 'software'
          ? 'Software work is listed separately in the GitHub Projects section.'
          : category === 'all'
            ? 'Sample slots only — no client work or finished creative samples are shown yet.'
            : `${visibleCount} replaceable sample ${visibleCount === 1 ? 'slot' : 'slots'} shown. Add genuine work before publishing project claims.`;
      });
    });
  }

  const repositoryGrid = document.querySelector('#repository-grid');
  const repositoryCarousel = document.querySelector('#repo-carousel');
  const repositoryViewport = document.querySelector('#repo-viewport');
  const repositoryPosition = document.querySelector('#repo-position');
  const repositoryPrevious = document.querySelector('#repo-previous');
  const repositoryNext = document.querySelector('#repo-next');
  const repositoryStatus = document.querySelector('#repo-status');
  const repositoryCount = document.querySelector('#repo-count');
  const repositoryCountNumber = document.querySelector('#repo-count-number');
  const repositoryCountAccessible = document.querySelector('#repo-count-accessible');
  const repositoryControls = document.querySelector('#repo-controls');
  const repositoryError = document.querySelector('#repo-error');
  const repositoryErrorMessage = document.querySelector('#repo-error-message');
  const repositorySearch = document.querySelector('#repo-search');
  const repositoryLanguage = document.querySelector('#repo-language');
  const repositoryRetry = document.querySelector('#repo-retry');

  if (repositoryGrid && repositoryCarousel && repositoryViewport && repositoryPosition && repositoryPrevious && repositoryNext && repositoryStatus && repositoryControls && repositoryError && repositorySearch && repositoryLanguage && repositoryRetry) {
    const apiUrl = 'https://api.github.com/users/mogambikim/repos?sort=updated&per_page=100';
    let repositories = [];
    let filteredRepositories = [];
    let renderedRepositoryCount = 0;
    let activeRepositoryIndex = 0;
    let scrollFrame = 0;
    const repositoryBatchSize = 8;

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

    const showRepositoryCount = count => {
      if (!repositoryCount || !repositoryCountNumber || !repositoryCountAccessible) return;
      repositoryCount.hidden = false;
      repositoryCountNumber.textContent = '0';
      repositoryCountAccessible.textContent = `${count} public repositories on GitHub.`;
      if (reducedMotion || !('requestAnimationFrame' in window)) {
        repositoryCountNumber.textContent = String(count);
        return;
      }

      const startedAt = performance.now();
      const duration = 850;
      const updateCount = now => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        repositoryCountNumber.textContent = String(Math.round(count * easedProgress));
        if (progress < 1) window.requestAnimationFrame(updateCount);
      };
      window.requestAnimationFrame(updateCount);
    };

    const createRepositoryCard = (repository, index) => {
      const card = makeElement('article', 'project-card repo-card reveal');
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${index + 1} of ${filteredRepositories.length}: ${repository.name || 'Unnamed repository'}`);
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

    const updateCarouselControls = () => {
      const total = filteredRepositories.length;
      const current = total ? Math.min(activeRepositoryIndex + 1, total) : 0;
      repositoryPosition.textContent = `${current} of ${total}`;
      repositoryPrevious.disabled = current <= 1;
      repositoryNext.disabled = current >= total;
    };

    const appendRepositoryBatch = () => {
      const nextEnd = Math.min(renderedRepositoryCount + repositoryBatchSize, filteredRepositories.length);
      for (let index = renderedRepositoryCount; index < nextEnd; index += 1) {
        const card = createRepositoryCard(filteredRepositories[index], index);
        if (card) repositoryGrid.append(card);
      }
      renderedRepositoryCount = nextEnd;
      updateCarouselControls();
    };

    const scrollToRepository = index => {
      if (index < 0 || index >= filteredRepositories.length) return;
      while (renderedRepositoryCount <= index) appendRepositoryBatch();
      const card = repositoryGrid.children[index];
      if (!card) return;
      activeRepositoryIndex = index;
      updateCarouselControls();
      if (renderedRepositoryCount < filteredRepositories.length && index >= renderedRepositoryCount - 4) appendRepositoryBatch();
      card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    };

    const updateActiveRepository = () => {
      scrollFrame = 0;
      const cards = repositoryGrid.children;
      if (!cards.length) return;
      const viewportLeft = repositoryViewport.getBoundingClientRect().left;
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      Array.from(cards).forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - viewportLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      activeRepositoryIndex = nearestIndex;
      updateCarouselControls();

      if (renderedRepositoryCount < filteredRepositories.length && nearestIndex >= renderedRepositoryCount - 4) {
        appendRepositoryBatch();
      }
    };

    const renderRepositories = () => {
      const searchTerm = repositorySearch.value.trim().toLocaleLowerCase();
      const language = repositoryLanguage.value;
      filteredRepositories = repositories.filter(repository => {
        const searchable = `${repository.name} ${repository.description || ''}`.toLocaleLowerCase();
        return (!searchTerm || searchable.includes(searchTerm)) && (!language || repository.language === language);
      });

      repositoryGrid.replaceChildren();
      renderedRepositoryCount = 0;
      activeRepositoryIndex = 0;
      repositoryViewport.scrollLeft = 0;
      repositoryCarousel.hidden = filteredRepositories.length === 0;
      if (filteredRepositories.length) appendRepositoryBatch();

      const shown = repositoryGrid.childElementCount;
      repositoryStatus.hidden = false;
      repositoryStatus.classList.remove('is-loading');
      repositoryStatus.textContent = shown
        ? `Showing ${filteredRepositories.length} matching public repositories.`
        : 'No repositories match these filters.';
    };

    const setLoadError = error => {
      repositoryStatus.hidden = true;
      repositoryControls.hidden = true;
      repositoryCarousel.hidden = true;
      repositoryGrid.replaceChildren();
      repositoryError.hidden = false;
      repositoryErrorMessage.textContent = error.message;
    };

    const loadRepositories = async () => {
      repositoryRetry.disabled = true;
      repositoryError.hidden = true;
      repositoryControls.hidden = true;
      repositoryCarousel.hidden = true;
      repositoryGrid.replaceChildren();
      repositoryStatus.hidden = false;
      repositoryStatus.classList.add('is-loading');
      repositoryStatus.innerHTML = '<span class="repo-spinner" aria-hidden="true"></span> Loading public repositories…';
      if (repositoryCount) repositoryCount.hidden = true;

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
        showRepositoryCount(repositories.length);

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
    repositoryPrevious.addEventListener('click', () => scrollToRepository(activeRepositoryIndex - 1));
    repositoryNext.addEventListener('click', () => scrollToRepository(activeRepositoryIndex + 1));
    repositoryViewport.addEventListener('scroll', () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActiveRepository);
    }, { passive: true });
    repositoryViewport.addEventListener('keydown', event => {
      if (event.target !== repositoryViewport) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToRepository(activeRepositoryIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToRepository(activeRepositoryIndex + 1);
      }
    });
    repositoryRetry.addEventListener('click', loadRepositories);
    loadRepositories();
  }
})();
