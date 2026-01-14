const API_URL = "http://localhost:3000/api";

// Cấu hình nhãn hiển thị cho các bảng dữ liệu thư viện
const COLUMN_LABELS = {
    // ===== SÁCH =====
    ma_sach: "Mã sách",
    MaSach: "Mã sách",
    ten_sach: "Tên sách",
    TenSach: "Tên sách",
    tac_gia: "Tác giả",
    gia_bia: "Giá bìa",
    so_luong_ton: "Số lượng tồn",

    // ===== THỂ LOẠI =====
    ma_the_loai: "Mã thể loại",
    ten_the_loai: "Tên thể loại",
    mo_ta: "Mô tả",

    // ===== NHÀ XUẤT BẢN =====
    ma_nxb: "Mã NXB",
    MaNXB: "Mã NXB",
    ten_nxb: "Tên NXB",
    TenNXB: "Tên NXB",
    dien_thoai: "Điện thoại",
    DienThoai: "Điện thoại",
    dia_chi: "Địa chỉ",
    DiaChi: "Địa chỉ",
    Email: "Email",

    // ===== ĐỘC GIẢ =====
    ma_dg: "Mã độc giả",
    MaDG: "Mã độc giả",
    ten_dg: "Tên độc giả",
    TenDG: "Tên độc giả",

    // ===== PHIẾU NHẬP =====
    ma_pn: "Mã phiếu nhập",
    MaPN: "Mã phiếu nhập",
    ngay_nhap: "Ngày nhập",
    NgayNhap: "Ngày nhập",
    so_luong: "Số lượng nhập",
    don_gia_nhap: "Giá nhập",

    // ===== PHIẾU MƯỢN & CHI TIẾT =====
    ma_pm: "Mã phiếu mượn",
    MaPM: "Mã phiếu mượn",
    ngay_muon: "Ngày mượn",
    NgayMuon: "Ngày mượn",
    tong_tien_coc: "Tổng tiền cọc",
    ma_ctpm: "Mã chi tiết",
    don_gia_coc: "Giá cọc/quyển",
    SoLuong: "Số lượng mượn",

    // ===== TỒN KHO =====
    ton_kho: "Tồn thực tế",
    gia_nhap: "Giá nhập"
};

const tableArea = document.getElementById("table-area");
let currentData = [];
let currentHeaders = [];
let currentType = "";

/* ================= 1. RENDER TABLE ================= */
function renderTable(headers, rows) {
    let html = `
    <table class="table-${currentType}" border="1" cellspacing="0" cellpadding="8" width="100%">
        <thead>
            <tr>
                ${headers.map(h => `<th>${COLUMN_LABELS[h] || h}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
    `;

    rows.forEach(row => {
        // Highlight hàng độc giả để click xem chi tiết
        if (currentType === "docgia") {
            html += `<tr class="click-row" onclick="viewDocGia(${row.ma_dg ?? row.MaDG})">`;
        } else {
            html += `<tr>`;
        }

        headers.forEach(h => {
            const value = row[h] ?? "";

            // Xử lý các ô có mã số để bấm xem chi tiết
            if (h === "ma_pm" || h === "MaPM") {
                html += `<td><span class="code-cell" onclick="viewPhieuMuon(${value})">${value}</span></td>`;
            }
            else if (h === "ma_pn" || h === "MaPN") {
                html += `<td><span class="code-cell" onclick="viewPhieuNhap(${value})">${value}</span></td>`;
            }
            else {
                html += `<td>${value}</td>`;
            }
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    return html;
}

/* ================= 2. XỬ LÝ CLICK MENU ================= */
document.querySelectorAll(".function-card").forEach(card => {
    card.addEventListener("click", async () => {
        const type = card.dataset.type;
        currentType = type;
        sessionStorage.setItem("currentTab", type); 

        try {
            // Hiển thị sách dạng Grid ảnh
            if (type === "sach") {
                const res = await fetch(API_URL + "/sach");
                currentData = await res.json();
                renderSachGrid(currentData);
                return;
            }

            // Hiển thị NXB dạng Logo Grid
            if (type === "nhaxuatban") {
                const res = await fetch(API_URL + "/nhaxuatban");
                currentData = await res.json();
                renderNXBGrid(currentData);
                return;
            }

            // Các bảng khác hiển thị Table
            const res = await fetch(`${API_URL}/${type}`);
            const data = await res.json();

            if (!data || data.length === 0) {
                tableArea.innerHTML = "<div class='welcome-msg'><p>Chưa có dữ liệu trong hệ thống.</p></div>";
                return;
            }

            currentData = data;
            currentHeaders = Object.keys(data[0]);
            renderTableWithSearchAndSort();

        } catch (err) {
            console.error(err);
            tableArea.innerHTML = "<p>Lỗi kết nối máy chủ!</p>";
        }
    });
});

/* ================= 3. CHỨC NĂNG TỒN KHO ================= */
document.querySelectorAll(".header-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        if (btn.dataset.type === "tonkho") {
            loadTonKho();
        }
    });
});

async function loadTonKho() {
    try {
        const res = await fetch(API_URL + "/tonkho");
        const data = await res.json();
        
        currentType = "tonkho";
        currentHeaders = ["ma_sach", "ten_sach", "ton_kho", "gia_nhap", "gia_bia"];
        currentData = data;

        renderTableWithSearchAndSort();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi tải báo cáo tồn kho");
    }
}

/* ================= 4. RENDER GRID (SÁCH & NXB) ================= */
function renderSachGrid(data) {
    let html = `
      <div class="search-sort-row">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm tên sách..." oninput="searchSach(this.value)" class="search-input">
        </div>
        <button class="add-btn" onclick="addNewItem('sach')">
            <i class="fa-solid fa-plus"></i> Thêm sách mới
        </button>
      </div>
      <div class="product-grid">
    `;

    data.forEach(s => {
        html += `
          <div class="product-card" onclick="viewSachDetail(${s.ma_sach})">
            <img src="../Anh/sach/${s.ma_sach}.jpg" onerror="this.src='../Anh/default.jpg'">
            <h4>${s.ten_sach}</h4>
            <p>Tồn: ${s.so_luong_ton} quyển</p>
          </div>
        `;
    });

    html += `</div>`;
    tableArea.innerHTML = html;
}

function renderNXBGrid(data) {
    let html = `<div class="product-grid">`;
    data.forEach(nxb => {
        html += `
          <div class="product-card" onclick="viewNXBDetail(${nxb.MaNXB || nxb.ma_nxb})">
            <img src="../Anh/ncc/${nxb.MaNXB || nxb.ma_nxb}.png" onerror="this.src='../Anh/default.jpg'">
            <h4>${nxb.TenNXB || nxb.ten_nxb}</h4>
          </div>`;
    });
    html += `</div>`;
    tableArea.innerHTML = html;
}

/* ================= 5. TÌM KIẾM & ĐIỀU HƯỚNG ================= */
function renderTableWithSearchAndSort() {
    // Xác định nhãn nút dựa trên tab hiện tại
    const btnLabels = {
        docgia: "Thêm độc giả",
        phieumuon: "Tạo phiếu mượn",
        phieunhap: "Tạo phiếu nhập",
        nhaxuatban: "Thêm NXB",
        theloai: "Thêm thể loại"
    };
    
    const label = btnLabels[currentType] || "Thêm mới";

    tableArea.innerHTML = `
      <div class="search-sort-row">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Nhập từ khóa tìm kiếm..." oninput="searchTable(this.value)" class="search-input">
        </div>
        <button class="add-btn" onclick="addNewItem('${currentType}')">
            <i class="fa-solid fa-plus"></i> ${label}
        </button>
      </div>
      ${renderTable(currentHeaders, currentData)}
    `;
}

function searchTable(keyword) {
    keyword = keyword.toLowerCase();
    const filtered = currentData.filter(row =>
        currentHeaders.some(h => String(row[h] ?? "").toLowerCase().includes(keyword))
    );
    tableArea.querySelector("table").outerHTML = renderTable(currentHeaders, filtered);
}

function searchSach(keyword) {
    keyword = keyword.toLowerCase();
    const filtered = currentData.filter(s =>
        s.ten_sach.toLowerCase().includes(keyword) || String(s.ma_sach).includes(keyword)
    );
    // Cập nhật lại Grid
    let gridHtml = `<div class="product-grid">`;
    filtered.forEach(s => {
        gridHtml += `
          <div class="product-card" onclick="viewSachDetail(${s.ma_sach})">
            <img src="../Anh/sach/${s.ma_sach}.jpg" onerror="this.src='../Anh/default.jpg'">
            <h4>${s.ten_sach}</h4>
            <p>Tồn: ${s.so_luong_ton}</p>
          </div>`;
    });
    gridHtml += `</div>`;
    tableArea.querySelector(".product-grid").outerHTML = gridHtml;
}

// Hàm điều hướng chi tiết
function viewSachDetail(id) { window.location.href = `../quanlysach/quanlysach.html?ma_sach=${id}`; }
function viewDocGia(id) { window.location.href = `../quanlydocgia/quanlydocgia.html?ma_dg=${id}`; }
function viewPhieuMuon(id) { window.location.href = `../quanlyphieumuon/quanlyphieumuon.html?ma_pm=${id}`; }
function viewPhieuNhap(id) { window.location.href = `../quanlyphieunhap/quanlyphieunhap.html?ma_pn=${id}`; }

/* ================= 6. KHỞI TẠO ================= */
window.addEventListener("load", () => {
    // Kiểm tra quyền truy cập (Auth)
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "../auth/dangnhap.html";
        return;
    }

    const tab = sessionStorage.getItem("currentTab") || "sach";
    const card = document.querySelector(`.function-card[data-type="${tab}"]`);
    if (card) card.click();
});

function addNewItem(type) {
    // Điều hướng đến trang chi tiết nhưng truyền tham số 'new' thay vì mã ID
    const routes = {
        sach: "../quanlysach/quanlysach.html?ma_sach=new",
        docgia: "../quanlydocgia/quanlydocgia.html?ma_dg=new",
        phieumuon: "../quanlyphieumuon/quanlyphieumuon.html?ma_pm=new",
        phieunhap: "../quanlyphieunhap/quanlyphieunhap.html?ma_pn=new"
    };

    if (routes[type]) {
        window.location.href = routes[type];
    } else {
        alert("Chức năng thêm mới cho " + type + " đang được cập nhật!");
    }
}