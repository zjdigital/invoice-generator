// ======================================
// CALCULATOR.JS
// Math operations for Invoice totals
// ======================================

function calculateRow(row) {
    const qty = Number(row.querySelector(".item-qty")?.value || 0);
    const price = Number(row.querySelector(".item-price")?.value || 0);

    // Subtotal = Qty * Harga
    const subtotal = qty * price;

    const subtotalInput = row.querySelector(".item-subtotal");
    if (subtotalInput) {
        subtotalInput.value = subtotal.toLocaleString("id-ID");
    }

    row.dataset.subtotal = subtotal;
    calculateGrandTotal();
}

function setElText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function calculateGrandTotal() {
    let totalBelanja = 0;

    // Sum all subtotal rows
    document.querySelectorAll("#itemTableBody tr").forEach(row => {
        totalBelanja += Number(row.dataset.subtotal || 0);
    });

    const discount = Number(document.getElementById("discount")?.value || 0);
    const delivery = Number(document.getElementById("deliveryFee")?.value || 0);
    const dp = Number(document.getElementById("downPayment")?.value || 0);

    // Formula: Total Belanja - Diskon + Biaya Kirim - DP
    const grandTotal = totalBelanja - discount + delivery - dp;

    // Update table footer
    setElText("totalSewaRow", "Rp " + totalBelanja.toLocaleString("id-ID"));

    // Update breakdown formula labels
    setElText("totalSewaLabel", "Rp " + totalBelanja.toLocaleString("id-ID"));
    setElText("discountLabel",  "Rp " + discount.toLocaleString("id-ID"));
    setElText("deliveryLabel",  "Rp " + delivery.toLocaleString("id-ID"));
    setElText("dpLabel",        "Rp " + dp.toLocaleString("id-ID"));

    // Update grand total
    setElText("grandTotal", "Total Akhir : Rp " + grandTotal.toLocaleString("id-ID"));

    // Sync live prompt preview
    if (typeof buildPrompt === "function") {
        const output = document.getElementById("promptOutput");
        if (output) output.value = buildPrompt();
    }
}

// Add auto listeners
document.addEventListener("DOMContentLoaded", () => {
    ["discount", "deliveryFee", "downPayment"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", calculateGrandTotal);
        }
    });
});
