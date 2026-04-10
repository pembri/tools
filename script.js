let isRunning = false;
let count = 0;
let botInterval;

function addLog(message) {
    const logBox = document.getElementById('logBox');
    const time = new Date().toLocaleTimeString();
    logBox.innerHTML += `<p>> [${time}] ${message}</p>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function toggleBot() {
    const btn = document.getElementById('mainBtn');
    const url = document.getElementById('targetUrl').value;
    const interval = document.getElementById('intervalTime').value * 1000;
    const threads = document.getElementById('threads').value;
    const statusText = document.getElementById('statusText');

    if (!isRunning) {
        if (!url || !url.startsWith('http')) {
            alert("Tolong masukkan URL yang valid (Gunakan http:// atau https://)");
            return;
        }
        
        isRunning = true;
        btn.innerText = "STOP ENGINE";
        btn.className = "btn stop";
        statusText.innerText = "RUNNING";
        statusText.style.color = "#4ade80";
        addLog("Bot started targeting: " + url);

        botInterval = setInterval(() => {
            // Menjalankan jumlah thread (pengulangan sekaligus)
            for (let i = 0; i < threads; i++) {
                const proxyFrame = document.createElement('iframe');
                proxyFrame.style.display = 'none';
                // Menambahkan parameter random agar server tidak menganggapnya cache
                proxyFrame.src = `${url}?cache_bust=${Math.random()}`;
                document.body.appendChild(proxyFrame);
                
                // Bersihkan elemen agar tidak membebani browser
                setTimeout(() => {
                    proxyFrame.remove();
                }, 2000);
            }

            count += parseInt(threads);
            document.getElementById('countDisplay').innerText = count;
            addLog(`Sent ${threads} hits to target...`);
        }, interval);

    } else {
        isRunning = false;
        btn.innerText = "START ENGINE";
        btn.className = "btn start";
        statusText.innerText = "IDLE";
        statusText.style.color = "#ff4d4d";
        clearInterval(botInterval);
        addLog("Bot stopped by user.");
    }
}
