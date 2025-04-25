document.addEventListener('DOMContentLoaded', function () {
    const summarizeButton = document.getElementById('summarizeButton');
    const viewSummaryButton = document.getElementById('viewSummaryButton');
    const urlElement = document.getElementById('url');
    const greenFlagsContainer = document.getElementById('greenFlags');
    const redFlagsContainer = document.getElementById('redFlags');
    const flagsContainer = document.getElementById('flagsContainer');
    const loadingText = document.getElementById('loadingText');
  
    let summaryData = null;
    let loadingInterval;
  
    summarizeButton.addEventListener('click', function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentURL = tabs[0].url;
        urlElement.textContent = currentURL;
  
        const cookiesEnabled = document.getElementById('cookieToggle').checked;
  
        // Show loading
        loadingText.style.display = 'block';
        loadingText.textContent = 'Loading';
        let dots = 0;
        loadingInterval = setInterval(() => {
          dots = (dots + 1) % 4;
          loadingText.textContent = 'Loading' + '.'.repeat(dots);
        }, 500);
  
        fetch('http://localhost:5000/receive-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: currentURL,
            cookiesEnabled: cookiesEnabled,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            clearInterval(loadingInterval);
            loadingText.style.display = 'none';
  
            console.log('Server Response:', data);
            summaryData = data;
            flagsContainer.style.display = 'block';
            populateFlags(data.green_flags, data.red_flags);
          })
          .catch((error) => {
            clearInterval(loadingInterval);
            loadingText.style.display = 'none';
            console.error('Error:', error);
          });
      });
    });
  
    viewSummaryButton.addEventListener('click', function () {
      if (summaryData) {
        alert(summaryData.summary);
      } else {
        alert('No summary available yet. Please click Summarize first.');
      }
    });
  
    function populateFlags(greenFlags, redFlags) {
      greenFlagsContainer.innerHTML = '';
      redFlagsContainer.innerHTML = '';
  
      if (greenFlags.length === 0) {
        greenFlagsContainer.innerHTML = '<li>No Green Flags Found</li>';
      } else {
        greenFlags.forEach(flag => {
          const li = document.createElement('li');
          li.textContent = flag;
          greenFlagsContainer.appendChild(li);
        });
      }
  
      if (redFlags.length === 0) {
        redFlagsContainer.innerHTML = '<li>No Red Flags Found</li>';
      } else {
        redFlags.forEach(flag => {
          const li = document.createElement('li');
          li.textContent = flag;
          redFlagsContainer.appendChild(li);
        });
      }
    }
  });
  
  
