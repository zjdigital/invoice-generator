// ==========================================
// PROMPT BUILDER
// Invoice Generator Prompt Engine
// ==========================================

function collectInvoiceItems() {
    const rows = document.querySelectorAll("#itemTableBody tr");
    let items = [];

    rows.forEach((row, index) => {
        const name = row.querySelector(".item-name")?.value || "";
        const qty = row.querySelector(".item-qty")?.value || 0;
        const price = row.querySelector(".item-price")?.value || 0;
        const subtotal = row.querySelector(".item-subtotal")?.value || 0;

        if (name) {
            items.push(
                `${index + 1}. ${name} | Qty: ${qty} | Harga Satuan: Rp ${Number(price).toLocaleString("id-ID")} | Subtotal: Rp ${subtotal}`
            );
        }
    });

    return items.length > 0 ? items.join("\n") : "(Belum ada item)";
}

function getActiveColorName() {
    const activeBtn = document.querySelector(".color-option.active");
    if (!activeBtn) return "Classic Navy (Biru)";
    
    const color = activeBtn.dataset.color;
    switch(color) {
        case "navy": return "Classic Navy (Biru)";
        case "emerald": return "Emerald Green (Hijau)";
        case "crimson": return "Crimson Velvet (Merah/Emas)";
        case "sunset": return "Sunset Orange (Jingga)";
        case "purple": return "Royal Purple (Ungu)";
        default: return "Classic Navy (Biru)";
    }
}

function buildPrompt() {
    const invoiceTheme = document.getElementById("invoiceTheme")?.value || "Umum";
    const colorScheme = getActiveColorName();

    const companyName = document.getElementById("companyName")?.value || "-";
    const website = document.getElementById("website")?.value || "-";
    const email = document.getElementById("email")?.value || "-";
    const phone = document.getElementById("phone")?.value || "-";
    const address = document.getElementById("address")?.value || "-";

    const invoiceNumber = document.getElementById("invoiceNumber")?.value || "-";
    const invoiceDate = document.getElementById("invoiceDate")?.value || "-";
    const dueDate = document.getElementById("dueDate")?.value || "-";
    const paymentStatus = document.getElementById("paymentStatus")?.value || "-";

    const customerName = document.getElementById("customerName")?.value || "-";
    const customerPhone = document.getElementById("customerPhone")?.value || "-";
    const customerEmail = document.getElementById("customerEmail")?.value || "-";
    const customerAddress = document.getElementById("customerAddress")?.value || "-";

    const bankName1 = document.getElementById("bankName1")?.value || "";
    const bankAccount1 = document.getElementById("bankAccount1")?.value || "";
    const bankHolder1 = document.getElementById("bankHolder1")?.value || "";
    
    const bankName2 = document.getElementById("bankName2")?.value || "";
    const bankAccount2 = document.getElementById("bankAccount2")?.value || "";
    const bankHolder2 = document.getElementById("bankHolder2")?.value || "";

    const discount = document.getElementById("discount")?.value || "0";
    const deliveryFee = document.getElementById("deliveryFee")?.value || "0";
    const downPayment = document.getElementById("downPayment")?.value || "0";
    const grandTotal = document.getElementById("grandTotal")?.innerText || "Rp 0";

    const items = collectInvoiceItems();

    let bankSection = "Pilihan Bank Transfer:";
    if (bankName1 && bankAccount1) {
        bankSection += `\n- ${bankName1}: ${bankAccount1} a.n ${bankHolder1}`;
    }
    if (bankName2 && bankAccount2) {
        bankSection += `\n- ${bankName2}: ${bankAccount2} a.n ${bankHolder2}`;
    }
    if (!bankName1 && !bankName2) {
        bankSection += "\n- (Tidak ada rekening bank)";
    }

    return `CREATE A PREMIUM SALES INVOICE FOR A ${invoiceTheme.toUpperCase()} BUSINESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI PERUSAHAAN (PENJUAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama Toko/Perusahaan: ${companyName}
Website: ${website}
Email: ${email}
Telepon/WhatsApp: ${phone}
Alamat: ${address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nomor Invoice: ${invoiceNumber}
Tanggal Invoice: ${invoiceDate}
Jatuh Tempo: ${dueDate}
Status Pembayaran: ${paymentStatus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI PELANGGAN (PEMBELI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama Pelanggan: ${customerName}
No HP: ${customerPhone}
Email: ${customerEmail}
Alamat: ${customerAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAFTAR BARANG / JASA YANG DIBELI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${items}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RINGKASAN PEMBAYARAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Belanja   : Rp ${Number(document.getElementById("totalSewaRow")?.innerText?.replace(/[^0-9]/g,"") || 0).toLocaleString("id-ID")}
Diskon          : Rp ${Number(discount).toLocaleString("id-ID")}
Biaya Kirim     : Rp ${Number(deliveryFee).toLocaleString("id-ID")}
DP / Uang Muka  : Rp ${Number(downPayment).toLocaleString("id-ID")}
${grandTotal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GAYA VISUAL & DESAIN INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kategori Bisnis : ${invoiceTheme} (sesuaikan ilustrasi, icon, dan dekorasi visual dengan tema ini)
Skema Warna     : ${colorScheme}
Kanvas          : A4 Portrait (Dokumen Siap Cetak)

Layout Header (Sejajar Horizontal):
- Area KIRI: Logo perusahaan + Nama Perusahaan + Detail Kontak
- Area TENGAH: Teks "INVOICE" besar bold + Teks "TERIMA KASIH ATAS KUNJUNGAN ANDA"
- Area KANAN: QR Code WhatsApp kontak toko
- Elemen diatur sejajar rapi (vertikal center aligned)

Tabel Item:
- Kolom: NO | NAMA BARANG / JASA | QTY | HARGA | SUBTOTAL
- PENTING: Tanpa kolom durasi.
- Baris terakhir tabel = Baris TOTAL BELANJA dengan warna latar lembut sesuai tema warna utama.

Bagian Bawah (Footer):
- Informasi Bank Transfer:
${bankSection}
- Catatan / Notes Syarat & Ketentuan Pembelian
- Area Tanda Tangan (3 Kolom Sejajar Horizontal):
  1. Kolom PEMBELI (kiri) — Tanda tangan tanda terima barang
  2. Kolom ADMIN (tengah) — Tanda tangan admin/penjual
  3. Kolom STEMPEL PERUSAHAAN (kanan) — Cap resmi logo perusahaan
- Footer teks penutup di bagian paling bawah.

Gaya Artistik:
- Minimalis modern, photorealistic ultra-detail
- Tema dekorasi visual disesuaikan kategori produk ${invoiceTheme}
- Desain bersih profesional dengan tipografi kontras`;
}
