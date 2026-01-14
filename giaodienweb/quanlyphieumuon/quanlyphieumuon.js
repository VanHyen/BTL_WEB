const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const ma_pm = params.get("ma_pm"); 

let selectedBooks = []; // Mảng tạm lưu trữ sách đang chọn
let currentSearchingBook = null;

// Khởi tạo trang
if (ma_pm === "new") {
    renderForm(null, "INSERT");
} else if (ma_pm) {
    loadLoanData(Number(ma_pm));
}

/* ================= 1. TẢI DỮ LIỆU PHIẾU CŨ ================= */
async function loadLoanData(id) {
    try {
        const res = await fetch(`${API_URL}/phieumuon/${id}`);
        const result = await res.json();
        const data = result.data ?? result;
        
        renderForm(data, "UPDATE");
        
        // Tải chi tiết sách đã mượn
        const resDetails = await fetch(`${API_URL}/ctpm?ma_pm=${id}`);
        selectedBooks = await resDetails.json();
        renderTempTable();
        updateTotal();
    } catch (err) {
        console.error("Lỗi tải phiếu mượn:", err);
    }
}

/* ================= 2. LOGIC TÌM KIẾM SÁCH THÔNG MINH ================= */
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

        // Lọc sách theo tên
        const filtered = allBooks.filter(b => 
            b.ten_sach.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length > 0) {
            resultsContainer.innerHTML = filtered.map(b => `
                <div class="search-item" onclick='selectBookToInput(${JSON.stringify(b)})'>
                    <div>
                        <b>${b.ten_sach}</b> <br>
                        <span>Tác giả: ${b.tac_gia}</span>
                    </div>
                    <div style="text-align: right">
                        <small>Kho: ${b.so_luong_ton} quyển</small>
                    </div>
                </div>
            `).join("");
            resultsContainer.style.display = "block";
        } else {
            resultsContainer.style.display = "none";
        }
    } catch (e) { console.error(e); }
}

function selectBookToInput(book) {
    document.getElementById("input_search_sach").value = book.ten_sach;
    document.getElementById("search-results").style.display = "none";
    
    // Kiểm tra trùng và tồn kho
    if (selectedBooks.find(b => b.ma_sach === book.ma_sach)) return alert("Sách này đã có trong danh sách!");
    if (book.so_luong_ton <= 0) return alert("Sách này đã hết trong kho!");

    selectedBooks.push({ ...book, so_luong: 1, don_gia_coc: book.gia_bia });
    renderTempTable();
    updateTotal();
    document.getElementById("input_search_sach").value = "";
}

/* ================= 3. RENDER BẢNG TẠM VÀ TÍNH TIỀN ================= */
function renderTempTable() {
    const body = document.getElementById("temp-book-body");
    body.innerHTML = selectedBooks.map((b, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><img src="../Anh/sach/${b.ma_sach}.jpg" onerror="this.src='../Anh/default.jpg'"></td>
            <td style="text-align:left"><b>${b.ten_sach}</b></td>
            <td><input type="number" value="${b.so_luong}" min="1" max="${b.so_luong_ton}" 
                onchange="updateQty(${index}, this.value)" style="width:50px; text-align:center"></td>
            <td style="text-align:right">${formatMoney(b.don_gia_coc || b.gia_bia)}</td>
            <td style="text-align:right; font-weight:bold">${formatMoney((b.so_luong) * (b.don_gia_coc || b.gia_bia))}</td>
            <td><button onclick="removeBook(${index})" style="color:red; border:none; background:none; cursor:pointer"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join("");
}

function updateQty(index, val) { 
    selectedBooks[index].so_luong = Number(val); 
    updateTotal();
    renderTempTable();
}

function removeBook(index) { 
    selectedBooks.splice(index, 1); 
    renderTempTable(); 
    updateTotal();
}

function updateTotal() {
    const sum = selectedBooks.reduce((acc, b) => acc + (b.so_luong * (b.don_gia_coc || b.gia_bia)), 0);
    document.getElementById("total").innerText = "Tổng tiền cọc: " + formatMoney(sum);
    document.getElementById("total-text").innerText = "Bằng chữ: " + numberToVietnamese(sum);
}

/* ================= 4. RENDER FORM VÀ CRUD ================= */
function renderForm(data, mode) {
    const isEdit = mode === "UPDATE";
    const box = document.getElementById("loan-form-content");
    box.innerHTML = `
        <div class="info-row"><b>Mã độc giả (ID)</b><input type="number" id="ma_dg" value="${isEdit ? data.ma_dg : ''}" placeholder="Nhập ID..."></div>
        <div class="info-row"><b>Ngày mượn</b><input type="date" id="ngay_muon" value="${isEdit ? data.ngay_muon.split('T')[0] : ''}"></div>
    `;

    const actionArea = document.getElementById("action-area");
    actionArea.innerHTML = `
        <button class="btn-back" onclick="window.history.back()">Trở về</button>
        ${isEdit ? `<button class="btn-delete" onclick="remove()">Xóa phiếu</button>` : ''}
        <button class="btn-save" onclick="${isEdit ? 'update()' : 'create()'}">${isEdit ? 'Cập nhật' : 'Tạo phiếu & Lưu sách'}</button>
    `;
}

async function create() {
    const ma_dg = document.getElementById("ma_dg").value;
    const ngay_muon = document.getElementById("ngay_muon").value;

    if (!ma_dg || !ngay_muon || selectedBooks.length === 0) return alert("Vui lòng nhập đủ thông tin và chọn ít nhất 1 cuốn sách!");

    // 1. Tạo phiếu mượn
    const resPm = await fetch(`${API_URL}/phieumuon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ma_dg: Number(ma_dg), ngay_muon })
    });

    if (resPm.ok) {
        alert("Đã tạo phiếu mượn thành công!");
        window.location.href = "../trangchu/trangchu.html";
    } else {
        alert("Lỗi: Mã độc giả không tồn tại!");
    }
}

async function remove() {
    if (confirm("Xóa phiếu mượn này?")) {
        await fetch(`${API_URL}/phieumuon/${ma_pm}`, { method: "DELETE" });
        window.location.href = "../trangchu/trangchu.html";
    }
}

/* ================= 5. TIỆN ÍCH ================= */
function formatMoney(v) { return Number(v).toLocaleString("vi-VN") + " đ"; }

function numberToVietnamese(n) {
    if (n === 0) return "Không đồng chẵn";
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