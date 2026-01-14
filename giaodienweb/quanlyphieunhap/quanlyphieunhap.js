const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const ma_phieu_nhap = params.get("ma_pn"); // Lấy mã phiếu nếu là chế độ xem

// Các phần tử DOM
const body = document.getElementById("detail-body");
const totalEl = document.getElementById("total");
const totalTextEl = document.getElementById("total-text");

let selectedBook = null; // Lưu trữ sách đang được chọn để nhập

// 1. KHỞI TẠO
if (ma_phieu_nhap && ma_phieu_nhap !== "new") {
    loadPhieuNhap(ma_phieu_nhap);
    document.getElementById("btn_save_phieu").style.display = "none"; // Ẩn nút lưu khi xem
} else {
    // Mặc định ngày nhập là hôm nay
    document.getElementById("ngay-nhap").valueAsDate = new Date();
}

/* ================= 2. TÌM KIẾM SÁCH THÔNG MINH ================= */
async function searchBookByName(query) {
    const resultsContainer = document.getElementById("search-results");
    if (query.trim().length < 2) {
        resultsContainer.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/sach`);
        const result = await res.json();
        const allBooks = result.data ?? result;

        const filtered = allBooks.filter(b => 
            b.ten_sach.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length > 0) {
            resultsContainer.innerHTML = filtered.map(b => `
                <div class="search-item" onclick='selectBookForImport(${JSON.stringify(b)})'>
                    <div><b>${b.ten_sach}</b><br><span>Mã: ${b.ma_sach}</span></div>
                    <div style="text-align: right"><small>Tồn hiện tại: ${b.so_luong_ton}</small></div>
                </div>
            `).join("");
            resultsContainer.style.display = "block";
        } else {
            resultsContainer.style.display = "none";
        }
    } catch (e) { console.error("Lỗi tìm kiếm:", e); }
}

function selectBookForImport(book) {
    selectedBook = {
        ...book,
        so_luong: 1,
        don_gia_nhap: book.gia_nhap || 0
    };
    document.getElementById("input_search_sach").value = book.ten_sach;
    document.getElementById("search-results").style.display = "none";
    renderImportTable();
}

/* ================= 3. HIỂN THỊ BẢNG VÀ TÍNH TOÁN ================= */
function renderImportTable() {
    if (!selectedBook) return;

    const thanhTien = selectedBook.so_luong * selectedBook.don_gia_nhap;
    body.innerHTML = `
        <tr>
            <td>1</td>
            <td><img src="../Anh/sach/${selectedBook.ma_sach}.jpg" onerror="this.src='../Anh/default.jpg'"></td>
            <td style="text-align:left">${selectedBook.ten_sach}</td>
            <td><input type="number" value="${selectedBook.so_luong}" min="1" oninput="updateData('qty', this.value)"></td>
            <td><input type="number" value="${selectedBook.don_gia_nhap}" oninput="updateData('price', this.value)"></td>
            <td style="text-align:right; font-weight:bold">${format(thanhTien)}</td>
            <td><button onclick="clearSelection()" style="color:red; border:none; background:none; cursor:pointer"><i class="fas fa-times"></i></button></td>
        </tr>
    `;
    updateTotal();
}

function updateData(type, val) {
    if (type === 'qty') selectedBook.so_luong = Number(val);
    if (type === 'price') selectedBook.don_gia_nhap = Number(val);
    renderImportTable();
}

function updateTotal() {
    const sum = selectedBook ? (selectedBook.so_luong * selectedBook.don_gia_nhap) : 0;
    totalEl.innerText = format(sum);
    totalTextEl.innerText = "Bằng chữ: " + capitalize(numberToVietnamese(sum));
}

function clearSelection() {
    selectedBook = null;
    body.innerHTML = "";
    updateTotal();
}

/* ================= 4. LƯU PHIẾU NHẬP ================= */
async function savePhieuNhap() {
    const ma_nxb = document.getElementById("ma_nxb").value;
    const ngay_nhap = document.getElementById("ngay-nhap").value;

    if (!ma_nxb || !ngay_nhap || !selectedBook) {
        alert("Vui lòng nhập đầy đủ thông tin NXB, ngày nhập và chọn sách!");
        return;
    }

    // Kiểm tra NXB tồn tại
    const checkNxb = await fetch(`${API_URL}/nhaxuatban/${ma_nxb}`);
    if (!checkNxb.ok) {
        alert("Mã nhà xuất bản không tồn tại!");
        return;
    }

    const data = {
        ma_nxb: Number(ma_nxb),
        ma_sach: selectedBook.ma_sach,
        ngay_nhap: ngay_nhap,
        so_luong: selectedBook.so_luong,
        don_gia_nhap: selectedBook.don_gia_nhap
    };

    try {
        const res = await fetch(`${API_URL}/phieunhap`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Nhập kho thành công! Số lượng tồn kho đã được cập nhật.");
            window.location.href = "../trangchu/trangchu.html";
        } else {
            alert("Lỗi khi lưu phiếu nhập!");
        }
    } catch (e) { console.error(e); }
}

/* ================= 5. CÁC HÀM TIỆN ÍCH ================= */
function format(v) { return Number(v).toLocaleString("vi-VN") + " đ"; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function numberToVietnamese(n) {
    if (n === 0) return "không đồng chẵn";
    const units = ["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"];
    function readTriple(num) {
        let tr = Math.floor(num / 100), ch = Math.floor((num % 100) / 10), dv = num % 10, s = "";
        if (tr > 0) s += units[tr] + " trăm ";
        if (ch > 1) s += units[ch] + " mươi "; else if (ch === 1) s += "mười "; else if (tr > 0 && dv > 0) s += "lẻ ";
        if (dv === 1 && ch > 1) s += "mốt "; else if (dv === 5 && ch > 0) s += "lăm "; else if (dv > 0) s += units[dv] + " ";
        return s.trim();
    }
    let result = "", million = Math.floor(n / 1_000_000), thousand = Math.floor((n % 1_000_000) / 1000), rest = n % 1000;
    if (million > 0) result += readTriple(million) + " triệu ";
    if (thousand > 0) result += readTriple(thousand) + " nghìn ";
    if (rest > 0) result += readTriple(rest);
    return result.trim() + " đồng chẵn";
}

function goBack() { window.history.back(); }