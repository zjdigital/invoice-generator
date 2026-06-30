// ======================================
// APP.JS - Invoice Generator
// Main Coordinator Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load settings from localStorage
    loadSettingsIntoForm();

    // 2. Initialize color theme select dropdown behavior (Allows 1 to 3 color combinations)
    const colorMap = {
        navy: "#1e40af",
        emerald: "#059669",
        crimson: "#be123c",
        sunset: "#d97706",
        purple: "#7e22ce",
        charcoal: "#111827",
        gold: "#fbbf24",
        white: "#ffffff"
    };

    let activeColors = ["navy"];

    function applyDynamicColors() {
        activeColors = [];
        const c1 = document.getElementById("colorSelect1")?.value;
        const c2 = document.getElementById("colorSelect2")?.value;
        const c3 = document.getElementById("colorSelect3")?.value;

        if (c1 && c1 !== "none") activeColors.push(c1);
        if (c2 && c2 !== "none") activeColors.push(c2);
        if (c3 && c3 !== "none") activeColors.push(c3);

        if (activeColors.length === 0) return;
        
        const primaryColor = colorMap[activeColors[0]];
        document.documentElement.style.setProperty('--primary', primaryColor);
        
        if (activeColors.length === 1) {
            document.documentElement.style.setProperty('--primary-light', primaryColor);
            document.documentElement.style.setProperty('--primary-dark', primaryColor);
        } else if (activeColors.length === 2) {
            document.documentElement.style.setProperty('--primary-light', colorMap[activeColors[1]]);
            document.documentElement.style.setProperty('--primary-dark', primaryColor);
        } else {
            document.documentElement.style.setProperty('--primary-light', colorMap[activeColors[1]]);
            document.documentElement.style.setProperty('--primary-dark', colorMap[activeColors[2]]);
        }
        
        // Update the sidebar gradient dynamically for premium design feel
        const gradient = activeColors.length === 1 
            ? `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor} 100%)`
            : activeColors.length === 2
            ? `linear-gradient(180deg, ${primaryColor} 0%, ${colorMap[activeColors[1]]} 100%)`
            : `linear-gradient(180deg, ${primaryColor} 0%, ${colorMap[activeColors[1]]} 50%, ${colorMap[activeColors[2]]} 100%)`;
        document.documentElement.style.setProperty('--sidebar-bg', gradient);
    }

    // Attach change events to dropdowns
    ["colorSelect1", "colorSelect2", "colorSelect3"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", () => {
                applyDynamicColors();
                calculateGrandTotal();
            });
        }
    });

    // Run once at start
    applyDynamicColors();

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
        
        // Convert to array of active colors
        const savedColors = settings.colorTheme.split(",");
        
        // Map to dropdown values
        if (savedColors[0]) {
            const el = document.getElementById("colorSelect1");
            if (el) el.value = savedColors[0];
        }
        if (savedColors[1]) {
            const el = document.getElementById("colorSelect2");
            if (el) el.value = savedColors[1];
        }
        if (savedColors[2]) {
            const el = document.getElementById("colorSelect3");
            if (el) el.value = savedColors[2];
        }
        
        applyDynamicColors();
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
