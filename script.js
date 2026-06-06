// Await DOM load to ensure elements exist before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    
    const copyBtn = document.getElementById('copy-btn');
    const ipInput = document.getElementById('server-ip');

    // Clipboard API implementation
    copyBtn.addEventListener('click', async () => {
        try {
            // Write the value to the user's clipboard
            await navigator.clipboard.writeText(ipInput.value);
            
            // UI Feedback state change
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            copyBtn.classList.add('copied');

            // Reset UI state after 2 seconds
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);

        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyBtn.innerText = 'Error';
            
            setTimeout(() => {
                copyBtn.innerText = 'Copy IP';
            }, 2000);
        }
    });
});