const shortCode =  document.getElementById('input');
const displayClicks = document.getElementById('total-clicks');
const displayDate= document.getElementById('date-display');
const displayTime = document.getElementById('time-display');
const displayLongURL = document.getElementById('long-url-display');
const displayShortCode = document.getElementById('active-short-code');
let formattedDate;
let formattedTime;
const url = document.location.host+'/'

function formatDate(dateString){
    const date = new Date(dateString);
    formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    // "Mar 20, 2026"
    formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })
    // "08:56:27 UTC"
}
// Auto-fetch when user types 6 characters
shortCode.addEventListener('input', async(e) => {
    const value = e.target.value.trim();
    if (value.length === 6) {
        console.log("fetching mongoDB")
        try {
            const response = await fetch("/analytics/"+value);
            const data = await response.json();
            displayClicks.textContent = data.clicks;
            console.log(data);
            formatDate(data.createdAt);
            displayDate.textContent = formattedDate;
            displayTime.textContent = formattedTime;
            displayLongURL.textContent = data.longUrl;
            displayShortCode.textContent = url + data.shortCode;
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
