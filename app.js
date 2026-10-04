'use strict';
const entries = window.ELYNDOR_ENTRIES;
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
    } else if (/^[A-H]\. |^Class [IVX]+|^Still to Develop$|^Established Foundations$/.test(block)) {
      container.append(element('h3', '', block));
    } else container.append(element('p', '', block.replace(/^> /gm, '')));
  });
}
function closeReader() { if ($('reader').open) $('reader').close(); }
function route() {
  const hash = location.hash;
  if (hash.startsWith('#entry/')) {
    const entry = entries.find(e => '#entry/' + e.id === hash);
    $('copy-status').textContent = '';
    $('reader-title').textContent = entry ? entry.name : 'This page has not been written.';
    $('reader-category').textContent = entry ? entry.category : 'ENTRY NOT FOUND';
    renderBody(entry ? entry.body : 'Return to the archive to find another entry.');
    $('reader-source').textContent = entry ? 'Source: ' + entry.source : '';
    $('copy-link').hidden = !entry;
    $('related').replaceChildren();
    if (entry) entries.filter(e => e.id !== entry.id && e.category === entry.category).slice(0,3).forEach(e => {const link = element('a','',e.name); link.href = '#entry/' + e.id; $('related').append(link);});
    if (!$('reader').open) { $('reader').showModal(); document.body.classList.add('reading'); }
    $('reader').scrollTop = 0;
    document.title = (entry ? entry.name : 'Entry not found') + ' | Elyndor';
  } else {
    closeReader();
    document.title = 'Elyndor | The Living Archive';
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
$('reader').addEventListener('close', () => { document.body.classList.remove('reading'); if (location.hash.startsWith('#entry/')) { history.replaceState(null, '', returnHash); document.title = 'Elyndor | The Living Archive'; } });
$('copy-link').onclick = async () => { try { await navigator.clipboard.writeText(location.href); $('copy-status').textContent = 'Link copied.'; } catch { $('copy-status').textContent = 'Copy the address from your browser to share this entry.'; } };
window.addEventListener('hashchange', route);
document.addEventListener('keydown', event => { if (event.key === '/' && !$('reader').open && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); $('search').focus(); $('archive').scrollIntoView(); } });
render(); route();
