/* Els textos de l'article són a continguts/*.md. */
const sectionIds = ['portada', 'perfil', 'cronologia', 'simbols', 'entrevistes', 'actualitat', 'conclusio', 'fonts'];
const byId = id => document.getElementById(id);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function readArticle() {
  const localCopy = byId('continguts-locals');
  if (localCopy) return JSON.parse(localCopy.textContent);
  const documents = await Promise.all(sectionIds.map(async id => {
    const response = await fetch('./continguts/' + id + '.md');
    if (!response.ok) throw new Error('No s’ha pogut obrir ' + id);
    return [id, await response.text()];
  }));
  return Object.fromEntries(documents);
}

// Cada encapçalament obre un grup fins al següent encapçalament del mateix nivell.
function groups(parent, tagName) {
  const intro = document.createDocumentFragment();
  const items = [];
  let content = intro;
  for (const node of Array.from(parent.children)) {
    if (node.tagName === tagName) {
      content = document.createDocumentFragment();
      items.push({ title: node.textContent, content });
    } else {
      content.append(node);
    }
  }
  return { intro, items };
}

function showCover(content, title) {
  byId('cover-title').replaceChildren(...title.childNodes);
  const deck = content.querySelector('h2');
  const caption = groups(content, 'H3');
  const deckText = element('p', 'subtitle', deck?.textContent);
  deck?.remove();
  byId('cover-deck').replaceChildren(deckText, caption.intro);
  if (caption.items.length) {
    byId('cover-caption').textContent = caption.items[0].title;
    byId('cover-location').textContent = caption.items[0].content.textContent.trim();
  }
  const siteTitle = byId('cover-title').textContent;
  document.title = siteTitle + ' · La plaça del Diamant';
  document.querySelectorAll('.brand span').forEach(brand => { brand.textContent = siteTitle; });
}

function showProfile(content) {
  const question = content.querySelector('blockquote');
  if (question) {
    byId('question-band').querySelector('p').textContent = question.textContent.trim();
    byId('question-band').hidden = false;
    question.remove();
  }
  byId('perfil-copy').append(content);
}

function showTimeline(stages) {
  const tablist = byId('timeline-tabs');
  const tabs = [];
  const panels = [];
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  }
  stages.forEach((stage, index) => {
    const tab = element('button', '', stage.title);
    tab.type = 'button';
    tab.id = 'etapa-' + index;
    tab.setAttribute('role', 'tab');
    const pane = element('div', 'timeline-pane');
    pane.id = 'lectura-' + index;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', tab.id);
    pane.tabIndex = 0;
    tab.setAttribute('aria-controls', pane.id);
    tab.addEventListener('click', () => select(index));
    const { intro, items } = groups(stage.content, 'H3');
    if (intro.childElementCount) pane.append(intro);
    items.forEach((piece, i) => {
      const article = element('article');
      article.append(element('span', 'small-label', i === 0 ? 'A casa' : 'A Barcelona'), element('h3', '', piece.title), piece.content);
      pane.append(article);
    });
    tabs.push(tab);
    panels.push(pane);
    tablist.append(tab);
    byId('timeline-panels').append(pane);
  });
  tablist.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const destinations = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    select(destinations[event.key], true);
  });
  select(0);
}

function showSymbols(symbols) {
  const controls = [];
  const sheets = [];
  function openSheet(selection) {
    controls.forEach((button, i) => {
      const open = selection === i;
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('.plus').textContent = open ? '−' : '+';
      sheets[i].hidden = !open;
    });
  }
  symbols.forEach((symbol, index) => {
    const button = element('button', 'symbol-open');
    button.type = 'button';
    button.id = 'gravat-' + index;
    const sheet = element('div', 'symbol-sheet');
    sheet.id = 'fitxa-' + index;
    sheet.setAttribute('role', 'region');
    sheet.setAttribute('aria-labelledby', button.id);
    button.setAttribute('aria-controls', sheet.id);
    const image = symbol.content.querySelector('img');
    if (image) {
      const paragraph = image.parentElement;
      image.width = 900;
      image.height = 600;
      image.loading = 'lazy';
      const thumbnail = image.cloneNode();
      thumbnail.alt = '';
      button.append(thumbnail);
      sheet.append(image);
      if (paragraph?.tagName === 'P' && !paragraph.textContent.trim() && !paragraph.children.length) paragraph.remove();
    }
    const label = element('span', 'symbol-label', symbol.title);
    const plus = element('span', 'plus', '+');
    plus.setAttribute('aria-hidden', 'true');
    label.append(plus);
    button.append(label);
    const copy = element('div');
    const close = element('button', 'close-sheet', 'Tanca la fitxa');
    close.type = 'button';
    close.addEventListener('click', () => {
      openSheet(-1);
      button.focus();
    });
    copy.append(symbol.content, close);
    sheet.append(copy);
    button.addEventListener('click', () => {
      const opening = sheet.hidden;
      openSheet(opening ? index : -1);
      if (opening) {
        const heading = copy.querySelector('h3') || copy;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        if (heading.getBoundingClientRect().top > window.innerHeight - 80) sheet.scrollIntoView({ block: 'start' });
      }
    });
    controls.push(button);
    sheets.push(sheet);
    byId('symbol-buttons').append(button);
    byId('symbol-panels').append(sheet);
  });
  openSheet(-1);
}

function disclosure(title, content, className) {
  const details = element('details');
  const body = element('div', className);
  body.append(content);
  details.append(element('summary', '', title), body);
  return details;
}

function showInterviews(roles) {
  roles.forEach(role => {
    const section = element('div', 'interview-group');
    const { intro, items } = groups(role.content, 'H3');
    section.append(element('h3', '', role.title), intro);
    items.forEach(question => section.append(disclosure(question.title, question.content, 'interview-answer')));
    byId('interviews').append(section);
  });
}

function showCases(stories) {
  stories.forEach(story => {
    const article = element('article', 'case-copy');
    if (story.content.querySelector('h3')) {
      article.append(element('span', 'small-label', story.title));
    } else {
      article.classList.add('reflection');
      article.append(element('h3', '', story.title));
    }
    article.append(story.content);
    byId('cases').append(article);
  });
}

function renderArticle(documents) {
  const parsed = {};
  sectionIds.forEach(id => {
    const template = document.createElement('template');
    template.innerHTML = marked.parse(documents[id]);
    const content = template.content;
    const title = content.querySelector('h1');
    if (!title) throw new Error('Falta el títol de ' + id);
    title.remove();
    parsed[id] = { content, title };
  });
  sectionIds.forEach(id => {
    const { title, content } = parsed[id];
    if (id === 'portada') { showCover(content, title); return; }
    byId(id + '-title').textContent = title.textContent;
    const indexLink = document.querySelector('#index-menu a[href="#' + id + '"]');
    if (id !== 'conclusio') indexLink.textContent = title.textContent;
    if (id === 'perfil') { showProfile(content); return; }
    if (id === 'conclusio') { byId('conclusio-copy').append(content); return; }
    const { intro, items } = groups(content, 'H2');
    if (id === 'fonts') {
      byId('source-list').append(intro);
      items.forEach(source => byId('source-list').append(disclosure(source.title, source.content, 'sources-body')));
      return;
    }
    byId(id + '-intro').append(intro);
    const render = { cronologia: showTimeline, simbols: showSymbols, entrevistes: showInterviews, actualitat: showCases };
    render[id](items);
  });
}

function setUpMenu() {
  const menu = byId('index-menu');
  const summary = menu.querySelector('summary');
  document.addEventListener('click', event => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
}

async function start() {
  setUpMenu();
  try {
    renderArticle(await readArticle());
    if (location.hash) byId(location.hash.slice(1))?.scrollIntoView();
    const links = document.querySelectorAll('.chapters a');
    const visibleSection = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-12% 0px -55%' });
    sectionIds.forEach(id => visibleSection.observe(byId(id)));
  } catch (error) {
    console.error(error);
    const status = byId('load-status');
    status.textContent = location.protocol === 'file:'
      ? 'Per llegir la web amb doble clic, obre la vista prèvia que acompanya el projecte.'
      : 'No s’ha pogut carregar el reportatge. Comprova la connexió i torna-ho a provar.';
    const retry = element('button', '', 'Torna-ho a provar');
    retry.addEventListener('click', () => location.reload());
    status.append(retry);
  }
}
start();
