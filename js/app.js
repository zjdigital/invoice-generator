// ======================================
// APP.JS - Invoice Generator
// Main Coordinator Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load settings from localStorage
    loadSettingsIntoForm();

    // 2. Initialize color theme picker behavior
    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            colorOptions.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            
            // Switch body theme class
            const color = opt.dataset.color;
            document.body.className = `theme-${color}`;
            
            // Recalculate and update prompt
            calculateGrandTotal();
        });
    });

    // 3. Generate button action
    const generateBtn = document.getElementById("generateBtn");
    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            const prompt = buildPrompt();
            const output = document.getElementById("promptOutput");
            if (output) {
                output.value = prompt;
                saveToHistory(prompt);
                
                // Visual success border flash
                output.style.borderColor = "var(--success)";
                setTimeout(() => {
                    output.style.borderColor = "";
                }, 1000);
            }
        });
    }

    // 4. Copy to clipboard button
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const output = document.getElementById("promptOutput");
            if (output && output.value) {
                navigator.clipboard.writeText(output.value).then(() => {
                    copyBtn.innerHTML = '<i class="fa fa-check"></i> Berhasil Dicopy!';
                    copyBtn.style.background = "#15803d";
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fa fa-copy"></i> Copy Prompt';
                        copyBtn.style.background = "";
                    }, 2000);
                });
            }
        });
    }

    // 5. Setup live sync on all form element changes
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.addEventListener("input", calculateGrandTotal);
        el.addEventListener("change", calculateGrandTotal);
    });

    // 6. Initial calculator invocation
    calculateGrandTotal();
});

// Load saved company & bank settings into Dashboard
function loadSettingsIntoForm() {
    const settings = JSON.parse(localStorage.getItem("generalInvoiceSettings") || "{}");
    if (!settings.companyName) return;

    const fields = [
        "companyName", "website", "email", "phone",
        "bankName1", "bankAccount1", "bankHolder1",
        "bankName2", "bankAccount2", "bankHolder2"
    ];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && settings[id]) el.value = settings[id];
    });

    const addressEl = document.getElementById("address");
    if (addressEl && settings.companyAddress) {
        addressEl.value = settings.companyAddress;
    }

    // Apply color theme from settings
    if (settings.colorTheme) {
        document.body.className = `theme-${settings.colorTheme}`;
        const activeOption = document.querySelector(`.color-option[data-color="${settings.colorTheme}"]`);
        if (activeOption) {
            document.querySelectorAll(".color-option").forEach(o => o.classList.remove("active"));
            activeOption.classList.add("active");
        }
    }
}

// Save prompt data to localStorage history
function saveToHistory(prompt) {
    const history = JSON.parse(localStorage.getItem("generalInvoiceHistory") || "[]");
    history.unshift({
        date: new Date().toLocaleString("id-ID"),
        prompt: prompt
    });

    // Cap history limit to 20
    if (history.length > 20) history.pop();
    localStorage.setItem("generalInvoiceHistory", JSON.stringify(history));
}
