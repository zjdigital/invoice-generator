// ======================================
// APP.JS - Invoice AI Designer
// Main application logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // Load settings from localStorage
    loadSettingsIntoForm();

    // Generate button
    const generateBtn = document.getElementById("generateBtn");
    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            const prompt = buildPrompt();
            const output = document.getElementById("promptOutput");
            if (output) {
                output.value = prompt;
                // Save to history
                saveToHistory(prompt);
                // Flash animation
                output.style.borderColor = "#22c55e";
                setTimeout(() => {
                    output.style.borderColor = "";
                }, 1000);
            }
        });
    }

    // Copy button
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const output = document.getElementById("promptOutput");
            if (output && output.value) {
                navigator.clipboard.writeText(output.value).then(() => {
                    copyBtn.textContent = "✓ Berhasil Dicopy!";
                    copyBtn.style.background = "#15803d";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy Prompt";
                        copyBtn.style.background = "";
                    }, 2000);
                });
            }
        });
    }

    // Live prompt update on any input change
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.addEventListener("input", () => {
            const prompt = buildPrompt();
            const output = document.getElementById("promptOutput");
            if (output) output.value = prompt;
        });
        el.addEventListener("change", () => {
            const prompt = buildPrompt();
            const output = document.getElementById("promptOutput");
            if (output) output.value = prompt;
        });
    });

    // Initial build
    const prompt = buildPrompt();
    const output = document.getElementById("promptOutput");
    if (output) output.value = prompt;

});

// ======================================
// LOAD SETTINGS
// ======================================

function loadSettingsIntoForm() {
    const settings = JSON.parse(
        localStorage.getItem("invoiceSettings") || "{}"
    );
    if (!settings.companyName) return;

    const fields = [
        "companyName", "website", "email",
        "phone", "address"
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && settings[id]) {
            if (id === "address") {
                el.value = settings.companyAddress || el.value;
            } else {
                el.value = settings[id];
            }
        }
    });
}

// ======================================
// SAVE TO HISTORY
// ======================================

function saveToHistory(prompt) {
    const history = JSON.parse(
        localStorage.getItem("invoiceHistory") || "[]"
    );
    history.unshift({
        date: new Date().toLocaleString("id-ID"),
        prompt: prompt
    });
    // Keep max 20 entries
    if (history.length > 20) history.pop();
    localStorage.setItem("invoiceHistory", JSON.stringify(history));
}