
  const form = document.querySelector('form');
  const aliasContainer = document.getElementById('alias-container');
  const toast = document.getElementById('toast-notification');
  const toastProgress = document.getElementById('toast-progress');

  function showToast(){
    // Darken ALIAS background
    aliasContainer.classList.remove('bg-surface-container-high/50');
    aliasContainer.classList.add('bg-black/80');

    // Show Toast
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    // Reset Progress Bar
    toastProgress.style.transition = 'none';
    toastProgress.style.width = '100%';
    
    setTimeout(() => {
      toastProgress.style.transition = 'width 3000ms linear';
      toastProgress.style.width = '0%';
    }, 10);

    // Reset after 3 seconds
    setTimeout(() => {
      // Hide Toast
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      toast.classList.remove('opacity-100', 'translate-y-0');
      
      // Reset ALIAS background
      aliasContainer.classList.add('bg-surface-container-high/50');
      aliasContainer.classList.remove('bg-black/80');
    }, 3000);
}
const longUrlForm = document.getElementById('long-url-form')
const longUrl = document.getElementById('long-url')
const shortCode = document.getElementById('short-code')
const currentUrl = window.location.href;
console.log(currentUrl)
longUrlForm.addEventListener('submit',async(e)=>{
    e.preventDefault()
    const result = await fetch('/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        longUrl: longUrl.value
      })
    })
    const data = await result.json()
    shortCode.textContent = shortCode.textContent = currentUrl+data.shortCode
    showToast()
  })

