console.log("TabSmart content script loaded");let e=null;chrome.runtime.onMessage.addListener((n,o,d)=>{console.log("Content script received message:",n),n.action==="togglePinned"&&(n.isPinned?(console.log("Creating sidebar"),t()):(console.log("Removing sidebar"),i()))});function t(){if(e)return;e=document.createElement("div"),e.id="tabsmart-sidebar",e.style.cssText=`
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
    z-index: 9999;
  `;const n=document.createElement("iframe");n.src=chrome.runtime.getURL("index.html"),n.style.cssText=`
    width: 100%;
    height: 100%;
    border: none;
  `,e.appendChild(n),document.body.appendChild(e),document.body.style.marginRight="400px"}function i(){e&&(document.body.removeChild(e),document.body.style.marginRight="0",e=null)}
