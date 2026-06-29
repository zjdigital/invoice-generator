// ======================================
// INVOICE.JS
// Dynamic Product / Jasa Table Row Manager
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addItemBtn");
    if (addBtn) {
        addBtn.addEventListener("click", addItemRow);
    }

    // Add 1 default row at startup
    addItemRow();
});

// Helper: Format to Indonesian Rupiah representation
function formatRupiah(number) {
    return Number(number || 0).toLocaleString("id-ID");
}

// Add row to items table
function addItemRow() {
    const tbody = document.getElementById("itemTableBody");
    if (!tbody) return;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input type="text" class="item-name" placeholder="Nama Barang / Jasa">
        </td>
        <td>
            <input type="number" class="item-qty" value="1" min="1">
        </td>
        <td>
            <input type="number" class="item-price" value="0" min="0">
        </td>
        <td>
            <input type="text" class="item-subtotal" value="0" readonly>
        </td>
        <td>
            <button class="btn-delete">
                <i class="fa fa-trash"></i> Hapus
            </button>
        </td>
    `;

    tbody.appendChild(row);
    bindRowEvents(row);
    calculateGrandTotal();
}

// Bind event listeners to row inputs
function bindRowEvents(row) {
    const qtyInput = row.querySelector(".item-qty");
    const priceInput = row.querySelector(".item-price");
    const deleteBtn = row.querySelector(".btn-delete");

    if (qtyInput) {
        qtyInput.addEventListener("input", () => calculateRow(row));
    }
    if (priceInput) {
        priceInput.addEventListener("input", () => calculateRow(row));
    }
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            row.remove();
            calculateGrandTotal();
        });
    }
}
