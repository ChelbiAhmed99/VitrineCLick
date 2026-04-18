document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const colorSelect = document.getElementById('color');
    const styleSelect = document.getElementById('style');
    const simulateFlag = document.getElementById('simulateFlag');
    const batchSizeSelect = document.getElementById('batchSize');

    const previewContainer = document.getElementById('previewContainer');
    const placeholderText = previewContainer.querySelector('.placeholder-text');
    const logoGrid = document.getElementById('logoGrid');
    const resultActions = document.getElementById('resultActions');
    const resetBtn = document.getElementById('resetBtn');

    const btnText = generateBtn.querySelector('.btn-text');
    const loaderDots = generateBtn.querySelector('.loader-dots');

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a logo prompt first!');
            return;
        }

        // UI State: Loading
        setLoading(true);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    color: colorSelect.value,
                    style: styleSelect.value,
                    batchSize: batchSizeSelect.value,
                    simulate: simulateFlag.checked
                })
            });

            const data = await response.json();

            if (data.success) {
                // Clear and Show logo grid
                logoGrid.innerHTML = '';
                data.imageUrls.forEach(url => {
                    const item = document.createElement('div');
                    item.className = 'logo-item';
                    item.innerHTML = `
                        <img src="${url}" alt="Generated Logo">
                        <div class="logo-overlay">
                            <a href="${url}" download class="download-icon-btn">Download</a>
                        </div>
                    `;
                    logoGrid.appendChild(item);
                });

                logoGrid.style.display = 'grid';
                placeholderText.style.display = 'none';
                resultActions.style.display = 'flex';
            } else {
                alert('Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during generation.');
        } finally {
            setLoading(false);
        }
    });

    resetBtn.addEventListener('click', () => {
        promptInput.value = '';
        logoGrid.style.display = 'none';
        logoGrid.innerHTML = '';
        placeholderText.style.display = 'block';
        resultActions.style.display = 'none';
    });

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            btnText.style.display = 'none';
            loaderDots.style.display = 'flex';
        } else {
            generateBtn.disabled = false;
            btnText.style.display = 'block';
            loaderDots.style.display = 'none';
        }
    }
});
