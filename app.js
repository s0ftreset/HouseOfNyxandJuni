'use strict';
const entries = window.ELYNDOR_ENTRIES;
const media = window.ELYNDOR_MEDIA || [];
let currentPhotoIndex = 0, currentPhotoGroup = [];
const categories = ['All entries', 'Characters', 'Places', 'Houses', 'Magic', 'Customs', 'Chronicles', 'Aerie & Dragons'];
const $ = id => document.getElementById(id);
let category = 'All entries', query = '', sort = 'featured', page = 1, returnHash = '#archive';
const pageSize = 12;
function normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function selectEntries() {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const found = entries.filter(entry => (category === 'All entries' || entry.category === category) && terms.every(term => normalize(entry.name + ' ' + entry.body + ' ' + entry.category).includes(term)));
  return sort === 'az' ? found.sort((a,b) => a.name.localeCompare(b.name)) : found;
}
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function mediaImage(photo) {
  const img = element('img'); img.src = photo.src; img.alt = photo.alt;
  img.width = photo.width; img.height = photo.height; img.loading = 'lazy'; img.decoding = 'async';
  return img;
}
function chatLink(photo) {
  const link = element('a', 'chat-link', 'Chat Here ↗');
  link.href = photo.chatUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Chat with ' + photo.title + ' on DreamJourney AI (opens in a new tab)');
  return link;
}
function photoButton(photo, group) {
  const button = element('button', 'photo-open'); button.type = 'button';
  button.setAttribute('aria-label', 'View full artwork: ' + photo.title);
  button.append(mediaImage(photo), element('span', 'photo-zoom', 'View full artwork ↗'));
  button.onclick = () => openPhoto(photo.id, group);
  return button;
}
function renderGalleries() {
  [['character', 'character-gallery'], ['location', 'location-gallery'], ['character', 'caer-portraits'], ['location', 'caer-map']].forEach(([kind,id]) => {
    const photos = media.filter(photo => photo.kind === kind && (!id.startsWith('caer-') || photo.collection === 'caer-avar')); 
    $(id).replaceChildren(...photos.map(photo => {
      const card = element('article', 'photo-card');
      const body = element('div', 'photo-caption');
      const title = element('h3'); const link = element('a', '', photo.title); link.href = '#entry/' + photo.entryId; title.append(link);
      const lore = element('a', 'photo-lore', 'Read the lore ↗'); lore.href = link.href;
      body.append(element('p', 'eyebrow', photo.subtitle), title, lore);
      if (photo.chatUrl) body.append(chatLink(photo));
      card.append(photoButton(photo, photos), body); return card;
    }));
    if (!photos.length) $(id).append(element('p', 'gallery-empty', 'Artwork will appear here as the collection grows.'));
  });
}
function renderEntryPhotos(entry) {
  const photos = entry ? media.filter(photo => photo.entryId === entry.id) : [];
  $('reader-photos').hidden = !photos.length;
  $('reader-photos').replaceChildren(...photos.map(photo => {
    const figure = element('figure'); figure.append(photoButton(photo, photos), element('figcaption', '', photo.caption)); return figure;
  }));
  $('reader-chat').replaceChildren();
  const character = photos.find(photo => photo.chatUrl);
  if (character) $('reader-chat').append(chatLink(character));
}
function renderCaerRecords() {
  const groups = ['The city & its people', 'The academy & Accord', 'The Calling & Concord', 'Dragon lore', 'Riders & their dragons'];
  $('caer-records').replaceChildren(...groups.map(group => {
    const records = entries.filter(entry => entry.collection === 'caer-avar' && entry.group === group);
    const section = element('details', 'caer-record-group');
    section.append(element('summary', '', group + ' · ' + records.length));
    const list = element('ul');
    records.forEach(entry => { const item = element('li'); const link = element('a', '', entry.name); link.href = '#entry/' + entry.id; item.append(link); list.append(item); });
    section.append(list); return section;
  }));
}
function renderSecrets() {
  const files = window.ELYNDOR_SECRETS || [];
  $('secret-files').replaceChildren(...files.map(file => {
    const details = element('details', 'secret-file');
    details.append(element('summary', '', file.title), element('p', '', file.body));
    if (file.photo) {
      const figure = element('figure', 'secret-artwork');
      figure.append(photoButton(file.photo, [file.photo]), element('figcaption', '', file.photo.caption));
      details.append(figure);
    }
    (file.sections || []).forEach(section => {
      const block = element('section', 'secret-section');
      block.append(element('h3', '', section.title), element('p', '', section.body));
      details.append(block);
    });
    return details;
  }));
  if (!files.length) $('secret-files').append(element('p', 'sealed-empty', 'The shelves are waiting. No secret records have been placed here yet.'));
}
let activeView = 'home';
function showView(hash) {
  const view = ['#caer-avar', '#caer-title'].includes(hash) ? 'caer' : ['#characters','#character-hall'].includes(hash) ? 'faces' : ['#secrets','#secrets-title'].includes(hash) ? 'secrets' : 'home';
  $('caer-view').hidden = view !== 'caer'; $('home').hidden = view !== 'home'; $('faces-view').hidden = view !== 'faces'; $('secrets-view').hidden = view !== 'secrets';
  if (view !== 'secrets') {
    $('spoiler-gate').open = false;
    document.querySelectorAll('.secret-file').forEach(file => { file.open = false; });
  }
  if (activeView !== view) window.scrollTo(0, 0);
  activeView = view;
  document.title = view === 'caer' ? 'Caer Avar | The Aerie' : view === 'faces' ? 'Faces of Elyndor | The Portrait Hall' : view === 'secrets' ? 'The Sealed Archive | Elyndor' : 'Elyndor | The Living Archive';
  document.querySelector('.skip').href = view === 'caer' ? '#caer-title' : view === 'faces' ? '#character-hall' : view === 'secrets' ? '#secrets-title' : '#archive';
}
function openPhoto(id, group) {
  currentPhotoGroup = group; currentPhotoIndex = group.findIndex(photo => photo.id === id);
  if (currentPhotoIndex < 0) return;
  updatePhoto(); $('lightbox').showModal(); document.body.classList.add('viewing-photo');
}
function updatePhoto() {
  const photo = currentPhotoGroup[currentPhotoIndex];
  $('lightbox-title').textContent = photo.title;
  $('lightbox-image').src = photo.src; $('lightbox-image').alt = photo.alt;
  $('lightbox-caption').textContent = photo.caption;
  $('photo-counter').textContent = (currentPhotoIndex + 1) + ' / ' + currentPhotoGroup.length;
  $('previous-photo').disabled = currentPhotoIndex === 0;
  $('next-photo').disabled = currentPhotoIndex === currentPhotoGroup.length - 1;
  $('previous-photo').hidden = $('next-photo').hidden = currentPhotoGroup.length < 2;
}
function movePhoto(delta) {
  const next = currentPhotoIndex + delta;
  if (next >= 0 && next < currentPhotoGroup.length) { currentPhotoIndex = next; updatePhoto(); }
}
function render() {
  $('filters').replaceChildren(...categories.map(name => { const button = element('button', '', name); button.type = 'button'; button.setAttribute('aria-pressed', String(category === name)); button.onclick = () => { category = name; page = 1; render(); }; return button; }));
  const found = selectEntries();
  const totalPages = Math.max(1, Math.ceil(found.length / pageSize)); page = Math.min(page, totalPages);
  $('result-count').textContent = found.length + (found.length === 1 ? ' entry' : ' entries') + (category === 'All entries' ? ' in the archive' : ' · ' + category);
  $('reset').hidden = !query && category === 'All entries';
  $('entries').replaceChildren();
  found.slice((page - 1) * pageSize, page * pageSize).forEach(entry => {
    const card = element('a', 'entry-card'); card.href = '#entry/' + entry.id;
    card.append(element('span', 'eyebrow', entry.category), element('h3', '', entry.name), element('p', 'excerpt', entry.body.split('\n\n')[0]));
    const read = element('span', 'read-entry', 'Read the entry'); read.append(element('span', '', '↗')); card.append(read); $('entries').append(card);
  });
  if (!found.length) $('entries').append(element('p', 'empty', 'No entries found. Try another spelling, a broader word, or clear the filters.'));
  $('pagination').replaceChildren();
  if (totalPages > 1) {
    const previous = element('button', '', '← Previous'), next = element('button', '', 'Next →');
    previous.disabled = page === 1; next.disabled = page === totalPages;
    previous.onclick = () => changePage(-1); next.onclick = () => changePage(1);
    $('pagination').append(previous, element('span', '', page + ' / ' + totalPages), next);
  }
}
function changePage(delta) { page += delta; render(); $('archive').scrollIntoView({behavior: 'instant'}); $('entries').querySelector('a')?.focus({preventScroll:true}); }
function renderBody(text) {
  const container = $('reader-body'); container.replaceChildren();
  text.split(/\n\n+/).forEach(block => {
    if (/^[-\d]/.test(block) && block.split('\n').every(line => /^(?:- |\d+\. )/.test(line))) {
      const list = element(/^\d/.test(block) ? 'ol' : 'ul'); block.split('\n').forEach(line => list.append(element('li', '', line.replace(/^(?:- |\d+\. )/, '')))); container.append(list);
    } else if (/^[A-H]\. |^Still to Develop$|^Established Foundations$/.test(block)) {
      container.append(element('h3', '', block));
    } else container.append(element('p', '', block.replace(/^> /gm, '')));
  });
}
function closeReader() { if ($('reader').open) $('reader').close(); }
function route() {
  const hash = location.hash;
  if (hash.startsWith('#entry/')) {
    const aliases = {"aerie-0": "caer-caer-avar", "aerie-1": "caer-avar-myren-caer-avar-s-founding", "aerie-2": "caer-the-aerie", "aerie-3": "caer-great-perch", "aerie-4": "caer-dragon-sovereignty-baseline", "aerie-5": "caer-concord-resonance-baseline", "aerie-6": "caer-concord-resonance-baseline", "aerie-7": "caer-the-calling", "aerie-8": "caer-first-ascent", "aerie-9": "caer-dragon-age-lifespan", "aerie-10": "caer-dragon-taxonomy-baseline", "aerie-11": "caer-dragon-taxonomy-baseline", "aerie-12": "caer-dragon-taxonomy-baseline", "aerie-13": "caer-dragon-taxonomy-baseline", "aerie-14": "caer-dragon-culture", "aerie-15": "caer-caer-avar-strategic-importance", "aerie-16": "caer-aerie-rider-stereotypes", "aerie-17": "caer-dragon-sovereignty-baseline"};
    const requestedId = hash.slice(7);
    const entry = entries.find(e => e.id === (aliases[requestedId] || requestedId));
    $('copy-status').textContent = '';
    $('reader-title').textContent = entry ? entry.name : 'This page has not been written.';
    $('reader-category').textContent = entry ? entry.category : 'ENTRY NOT FOUND';
    renderBody(entry ? entry.body : 'Return to the archive to find another entry.');
    renderEntryPhotos(entry);
    $('reader-source').textContent = entry ? 'Source: ' + entry.source : '';
    $('copy-link').hidden = !entry;
    $('related').replaceChildren();
    if (entry) entries.filter(e => e.id !== entry.id && e.category === entry.category).slice(0,3).forEach(e => {const link = element('a','',e.name); link.href = '#entry/' + e.id; $('related').append(link);});
    if (!$('reader').open) { $('reader').showModal(); document.body.classList.add('reading'); }
    $('reader').scrollTop = 0;
    document.title = (entry ? entry.name : 'Entry not found') + ' | Elyndor';
  } else {
    closeReader();
    showView(hash);
    if (hash.startsWith('#category/')) {
      let name; try { name = decodeURIComponent(hash.slice(10)); } catch { name = ''; }
      if (categories.includes(name)) { category = name; query = ''; $('search').value = ''; page = 1; render(); $('archive').scrollIntoView(); }
    }
    returnHash = hash || '#archive';
  }
}
$('search').addEventListener('input', event => { query = event.target.value; page = 1; render(); });
$('sort').addEventListener('change', event => { sort = event.target.value; page = 1; render(); });
$('reset').onclick = () => { category = 'All entries'; query = ''; page = 1; $('search').value = ''; render(); $('search').focus(); };
$('close-reader').onclick = closeReader;
$('reader').addEventListener('click', event => { if (event.target === $('reader')) { const rect = $('reader').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeReader(); } });
$('reader').addEventListener('close', () => { document.body.classList.remove('reading'); if (location.hash.startsWith('#entry/')) { history.replaceState(null, '', returnHash); showView(returnHash); } });
$('copy-link').onclick = async () => { try { await navigator.clipboard.writeText(location.href); $('copy-status').textContent = 'Link copied.'; } catch { $('copy-status').textContent = 'Copy the address from your browser to share this entry.'; } };
window.addEventListener('hashchange', route);
$('close-lightbox').onclick = () => $('lightbox').close();
$('previous-photo').onclick = () => movePhoto(-1);
$('next-photo').onclick = () => movePhoto(1);
$('lightbox').addEventListener('close', () => document.body.classList.remove('viewing-photo'));
$('lightbox').addEventListener('click', event => {
  if (event.target !== $('lightbox')) return;
  const rect = $('lightbox').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('lightbox').close();
});
let secretKeys = '';
document.addEventListener('keydown', event => {
  if ($('lightbox').open) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
    return;
  }
  const typing = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
  if (!typing && !$('reader').open && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
    secretKeys = (secretKeys + event.key.toLowerCase()).slice(-6);
    if (secretKeys === 'thorns') { location.hash = '#secrets'; secretKeys = ''; }
  }
  if (event.key === '/' && !$('reader').open && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); showView('#archive'); location.hash = '#archive'; $('search').focus(); $('archive').scrollIntoView(); }
});
renderGalleries(); renderCaerRecords(); renderSecrets(); render(); route();
