// ======================================
// APP.JS - Invoice Generator
// Main Coordinator Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load settings from localStorage
    loadSettingsIntoForm();

    // 2. Initialize color theme picker behavior (Allows 1 to 3 color combinations)
    const colorMap = {
        navy: "#1e40af",
        emerald: "#059669",
        crimson: "#be123c",
        sunset: "#d97706",
        purple: "#7e22ce",
        charcoal: "#111827",
        gold: "#fbbf24"
    };

    let activeColors = [];
    // Read initial active element from HTML
    const initialActive = document.querySelector(".color-option.active");
    if (initialActive) {
        activeColors.push(initialActive.dataset.color);
    } else {
        activeColors.push("navy");
    }

    function applyDynamicColors() {
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

    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            const color = opt.dataset.color;
            const index = activeColors.indexOf(color);
            
            if (index > -1) {
                // If already active, deselect (if more than 1 selected)
                if (activeColors.length > 1) {
                    activeColors.splice(index, 1);
                    opt.classList.remove("active");
                }
            } else {
                // Add new color
                if (activeColors.length >= 3) {
                    // Remove oldest active class
                    const oldestColor = activeColors.shift();
                    const oldestOpt = document.querySelector(`.color-option[data-color="${oldestColor}"]`);
                    if (oldestOpt) oldestOpt.classList.remove("active");
                }
                activeColors.push(color);
                opt.classList.add("active");
            }
            
            applyDynamicColors();
            calculateGrandTotal();
        });
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
        activeColors = settings.colorTheme.split(",");
        
        // Clear all default active classes
        document.querySelectorAll(".color-option").forEach(o => o.classList.remove("active"));
        
        activeColors.forEach(color => {
            const opt = document.querySelector(`.color-option[data-color="${color}"]`);
            if (opt) opt.classList.add("active");
        });
        
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
