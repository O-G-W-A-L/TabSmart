console.log('TabSmart content script loaded');

let sidebar = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  if (request.action === 'togglePinned') {
    if (request.isPinned) {
      console.log('Creating sidebar');
      createSidebar();
    } else {
      console.log('Removing sidebar');
      removeSidebar();
    }
  }
});

function createSidebar() {
  if (sidebar) return;

  sidebar = document.createElement('div');
  sidebar.id = 'tabsmart-sidebar';
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
    z-index: 9999;
  `;

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('index.html');
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;

  sidebar.appendChild(iframe);
  document.body.appendChild(sidebar);
  document.body.style.marginRight = '400px';
}

function removeSidebar() {
  if (sidebar) {
    document.body.removeChild(sidebar);
    document.body.style.marginRight = '0';
    sidebar = null;
  }
}