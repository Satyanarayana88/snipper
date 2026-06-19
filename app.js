import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const createView = document.getElementById('create-view');
const myUrlsView = document.getElementById('my-urls-view');
const tabButtons = document.querySelectorAll('.tab-btn');
const longUrlInput = document.getElementById('long-url-input');
const snipBtn = document.getElementById('snip-btn');
const resultBox = document.getElementById('result-box');
const shortUrlSpan = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const urlsList = document.getElementById('urls-list');

let currentView = 'create';

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;
    switchTab(targetTab);
  });
});

function switchTab(tab) {
  currentView = tab;
  
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tab === 'create') {
    createView.classList.remove('hidden');
    myUrlsView.classList.add('hidden');
  } else {
    createView.classList.add('hidden');
    myUrlsView.classList.remove('hidden');
    resultBox.classList.add('hidden');
    loadMyUrls();
  }
}

// TODO (Live Session): Generate a random 6-character alphanumeric code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// TODO (Live Session): Save URL to Firestore
async function saveUrl(code, longUrl) {
  const urlsRef = collection(db, 'urls');
  await addDoc(urlsRef, {
    code,
    longUrl,
    createdAt: serverTimestamp()
  });
}
snipBtn.addEventListener('click', async () => {
  const longUrl = longUrlInput.value.trim();

  if (!longUrl) {
    alert('Please enter a URL');
    return;
  }

  if (!isValidUrl(longUrl)) {
    alert('Please enter a valid URL (must start with http:// or https://)');
    return;
  }

  snipBtn.disabled = true;
  snipBtn.textContent = 'Creating...';

  try {
    const code = generateCode();
    
    if (!code || code.length !== 6) {
      throw new Error('Invalid code generated');
    }

    await saveUrl(code, longUrl);

    const shortUrl = `${window.location.origin}/redirect.html?code=${code}`;
    shortUrlSpan.textContent = shortUrl;
    resultBox.classList.remove('hidden');

    longUrlInput.value = '';
  } catch (error) {
    console.error('Error creating short URL:', error);
    alert('Failed to create short URL. Please try again.');
  } finally {
    snipBtn.disabled = false;
    snipBtn.textContent = 'Snip it';
  }
});

copyBtn.addEventListener('click', async () => {
  const url = shortUrlSpan.textContent;
  
  try {
    await navigator.clipboard.writeText(url);
    copyBtn.innerHTML = '✓';
    
    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
    alert('Failed to copy to clipboard');
  }
});

async function loadMyUrls() {
  urlsList.innerHTML = '<p class="loading">Loading your URLs...</p>';

  try {
    const urlsRef = collection(db, 'urls');
    const q = query(urlsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      urlsList.innerHTML = '<p class="empty-state">No URLs yet. Create your first one!</p>';
      return;
    }

    urlsList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const urlItem = createUrlItem(data.code, data.longUrl);
      urlsList.appendChild(urlItem);
    });
  } catch (error) {
    console.error('Error loading URLs:', error);
    urlsList.innerHTML = '<p class="error-message">Failed to load URLs</p>';
  }
}

function createUrlItem(code, longUrl) {
  const item = document.createElement('div');
  item.className = 'url-item';

  const shortUrl = `${window.location.origin}/redirect.html?code=${code}`;

  item.innerHTML = `
    <div class="url-item-row">
      <div class="url-item-short">${shortUrl}</div>
      <button class="url-item-copy-btn" title="Copy to clipboard">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
    <div class="url-item-long">${longUrl}</div>
  `;

  const copyButton = item.querySelector('.url-item-copy-btn');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      copyButton.innerHTML = '✓';
      
      setTimeout(() => {
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  });

  return item;
}
