// ==========================================
// PROMPT BUILDER
// Invoice AI Designer V1
// ==========================================

function collectEquipmentItems() {

    const rows = document.querySelectorAll(
        "#itemTableBody tr"
    );

    let items = [];

    rows.forEach((row, index) => {

        const name =
            row.querySelector(".item-name")
            ?.value || "";

        const qty =
            row.querySelector(".item-qty")
            ?.value || 0;

        const price =
            row.querySelector(".item-price")
            ?.value || 0;

        const subtotal =
            row.querySelector(".item-subtotal")
            ?.value || 0;

        if (name) {
            items.push(
                `${index + 1}. ${name} | Qty: ${qty} | Harga: Rp ${Number(price).toLocaleString("id-ID")} | Subtotal: Rp ${Number(qty * price).toLocaleString("id-ID")}`
            );
        }

    });

    return items.length > 0
        ? items.join("\n")
        : "(Belum ada item)";

}

// ==========================================
// BUILD PROMPT
// ==========================================

function buildPrompt() {

    const companyName =
        document.getElementById("companyName")?.value || "-";

    const website =
        document.getElementById("website")?.value || "-";

    const email =
        document.getElementById("email")?.value || "-";

    const phone =
        document.getElementById("phone")?.value || "-";

    const address =
        document.getElementById("address")?.value || "-";

    const invoiceNumber =
        document.getElementById("invoiceNumber")?.value || "-";

    const invoiceDate =
        document.getElementById("invoiceDate")?.value || "-";

    const dueDate =
        document.getElementById("dueDate")?.value || "-";

    const paymentStatus =
        document.getElementById("paymentStatus")?.value || "-";

    const customerName =
        document.getElementById("customerName")?.value || "-";

    const customerPhone =
        document.getElementById("customerPhone")?.value || "-";

    const customerEmail =
        document.getElementById("customerEmail")?.value || "-";

    const customerAddress =
        document.getElementById("customerAddress")?.value || "-";

    const discount =
        document.getElementById("discount")?.value || "0";

    const deliveryFee =
        document.getElementById("deliveryFee")?.value || "0";

    const pickupFee =
        document.getElementById("pickupFee")?.value || "0";

    const downPayment =
        document.getElementById("downPayment")?.value || "0";

    const grandTotal =
        document.getElementById("grandTotal")?.innerText || "Rp 0";

    const items = collectEquipmentItems();

    return `CREATE A PREMIUM CORPORATE MEDICAL EQUIPMENT RENTAL INVOICE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI PERUSAHAAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama Perusahaan: ${companyName}
Website: ${website}
Email: ${email}
Telepon: ${phone}
Alamat: ${address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nomor Invoice: ${invoiceNumber}
Tanggal Invoice: ${invoiceDate}
Jatuh Tempo: ${dueDate}
Status Pembayaran: ${paymentStatus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI PENYEWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama: ${customerName}
No HP: ${customerPhone}
Email: ${customerEmail}
Alamat: ${customerAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAFTAR ALAT YANG DISEWA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${items}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RINGKASAN PEMBAYARAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Sewa Alat : Rp ${Number(document.getElementById("totalSewaRow")?.innerText?.replace(/[^0-9]/g,"") || 0).toLocaleString("id-ID")}
Diskon          : Rp ${Number(discount).toLocaleString("id-ID")}
Biaya Antar     : Rp ${Number(deliveryFee).toLocaleString("id-ID")}
Biaya Ambil     : Rp ${Number(pickupFee).toLocaleString("id-ID")}
DP / Uang Muka  : Rp ${Number(downPayment).toLocaleString("id-ID")}
${grandTotal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GAYA VISUAL INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Template: Premium Corporate Medical Blue
Tema: Premium Corporate Blue Medical
Kanvas: A4 Portrait (21x29.7cm)

Layout Header (PENTING - Sejajar Horizontal):
- Area KIRI: Logo perusahaan + nama perusahaan + kontak (website, email, telepon, alamat)
- Area TENGAH: Teks "INVOICE" besar bold + teks "SEWA ALAT KESEHATAN" + teks "TERIMA KASIH ATAS KEPERCAYAAN ANDA" — semua teks ini HARUS sejajar secara vertikal dengan logo di kiri, bukan di bawahnya
- Area KANAN: QR Code WhatsApp + tombol "HUBUNGI KAMI VIA WHATSAPP" + teks "SCAN QR CODE"
- Header dirancang agar logo, teks INVOICE, dan QR berada pada baris yang sama (vertikal center aligned)

Tabel Daftar Alat Yang Disewa:
- Kolom: NO | NAMA ALAT | QTY | HARGA | SUBTOTAL
- PENTING: Tidak ada kolom DURASI / HARGA PER HARI
- Header kolom keempat adalah "HARGA" (bukan "HARGA/HARI")
- SUBTOTAL = QTY × HARGA (durasi TIDAK mempengaruhi subtotal)

Layout Halaman:
- Informasi Invoice dan Informasi Penyewa (2 kolom)
- Tabel Daftar Alat Yang Disewa:
  * Kolom: NO | NAMA ALAT | QTY | HARGA | SUBTOTAL
  * Setiap baris alat disertai foto/gambar alat di kolom Nama Alat
  * Baris terakhir tabel = baris TOTAL SEWA (background biru muda, teks bold biru):
    teks "TOTAL SEWA" rata kanan | nilai total semua subtotal
- Ringkasan Pembayaran (SATU KOLOM LEBAR PENUH):
  Format tabel ringkasan:
    Total Sewa Alat  :  Rp xxx
    Diskon           :  Rp xxx
    Biaya Antar      :  Rp xxx
    Biaya Ambil      :  Rp xxx
    DP / Uang Muka   :  Rp xxx
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    TOTAL AKHIR      :  Rp xxx  (besar, bold, warna biru tua)
  Rumus: TOTAL AKHIR = Total Sewa - Diskon + Biaya Antar + Biaya Ambil - DP
  PENTING: TIDAK ADA kolom Pembayaran QRIS di samping — ringkasan mengambil lebar penuh
- Rekening Bank (BCA, Mandiri, BRI) — lebar penuh
- Catatan / Notes
- Area Tanda Tangan:
  PENTING: Hanya 2 elemen tanda tangan:
  1. Kolom ADMIN (tengah) — dengan garis tanda tangan dan nama admin
  2. Kolom STEMPEL PERUSAHAAN (kanan) — dengan logo stempel cap perusahaan
  TIDAK ADA kolom tanda tangan Penyewa
- Footer: PROFESSIONAL • AMAN • TERPERCAYA

Gaya Desain:
- Photorealistic, Ultra Detail
- Medical Corporate Branding
- Premium Invoice Design
- Gradien Biru Modern
- Latar Belakang Putih Bersih
- Tipografi Profesional
- Print Ready, Kualitas Tinggi`;
}