import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const redirectMessage = document.getElementById('redirect-message');

function getCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

async function handleRedirect() {
  const code = getCodeFromUrl();

  if (!code) {
    redirectMessage.textContent = 'Invalid link - no code provided';
    return;
  }

  try {
    const urlsRef = collection(db, 'urls');
    const q = query(urlsRef, where('code', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      redirectMessage.textContent = 'Link not found';
      return;
    }

    const doc = querySnapshot.docs[0];
    const longUrl = doc.data().longUrl;

    redirectMessage.textContent = 'Redirecting...';
    window.location.href = longUrl;
  } catch (error) {
    console.error('Error during redirect:', error);
    redirectMessage.textContent = 'Error: Unable to redirect';
  }
}

handleRedirect();
