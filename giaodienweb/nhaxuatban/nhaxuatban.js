const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const ma_nxb = params.get("ma_nxb"); // Lấy mã NXB từ URL

let originalData = null; // Lưu dữ liệu gốc để so sánh thay đổi

// 1. KHỞI TẠO TRANG
if (ma_nxb === "new") {
    renderEmptyForm(); // Chế độ thêm mới
} else if (ma_nxb) {
    loadNxbData(Number(ma_nxb)); // Chế độ xem/sửa
}

/* ================= 2. TẢI DỮ LIỆU NHÀ XUẤT BẢN ================= */
async function loadNxbData(id) {
    try {
        const res = await fetch(`${API_URL}/nhaxuatban/${id}`);
        const result = await res.json();
        const ncc = result.data ?? result;
        originalData = { ...ncc };

        // Hiển thị ảnh/logo NXB
        const img = document.getElementById("nxb-img");
        img.src = `../Anh/nxb/${ncc.ma_nxb}.png`;
        img.onerror = () => img.src = "../Anh/nxb/default_nxb.png";

        renderForm(ncc, "UPDATE");
    } catch (e) {
        console.error("Lỗi tải NXB:", e);
        document.getElementById("nxb-info-box").innerHTML = "<p>Không tìm thấy nhà xuất bản!</p>";
    }
}

/* ================= 3. RENDER FORM TRỐNG (THÊM MỚI) ================= */
function renderEmptyForm() {
    const img = document.getElementById("nxb-img");
    img.src = "../Anh/nxb/default_nxb.png";
    
    const emptyNxb = {
        ma_nxb: "", ten_nxb: "", dien_thoai: "", 
        email: "", dia_chi: ""
    };
    renderForm(emptyNxb, "INSERT");
}

/* ================= 4. HÀM RENDER FORM CHUNG ================= */
function renderForm(n, mode) {
    const isEdit = mode === "UPDATE";
    const box = document.getElementById("nxb-info-box");

    box.innerHTML = `
        <h2>${isEdit ? "CHI TIẾT NHÀ XUẤT BẢN" : "THÊM NHÀ XUẤT BẢN MỚI"}</h2>

        ${row("Mã NXB", `<input id="inp_ma_nxb" value="${n.ma_nxb}" disabled placeholder="Tự động tăng">`)}
        ${row("Tên NXB", `
            <input id="ten_nxb" value="${n.ten_nxb}">
            <div class="error" id="e_ten_nxb"></div>
        `)}
        ${row("Điện thoại", `
            <input id="dien_thoai" value="${n.dien_thoai ?? ""}">
            <div class="error" id="e_dien_thoai"></div>
        `)}
        ${row("Email", `
            <input id="email" value="${n.email ?? ""}">
            <div class="error" id="e_email"></div>
        `)}
        ${row("Địa chỉ", `
            <input id="dia_chi" value="${n.dia_chi ?? ""}">
        `)}

        <div class="button-group">
            <button class="btn-back" onclick="goBack()">⬅ Trở về</button>
            <button id="btnAction" class="btn-save" onclick="${isEdit ? "update()" : "create()"}">
                ${isEdit ? "💾 Cập nhật" : "➕ Lưu NXB mới"}
            </button>
        </div>
    `;

    // Gán sự kiện Validate khi người dùng nhập
    document.querySelectorAll("#ten_nxb, #dien_thoai, #email, #dia_chi").forEach(i => {
        i.addEventListener("input", () => validateAll(mode));
    });

    validateAll(mode); // Kiểm tra lần đầu
}

/* ================= 5. HÀM TẠO DÒNG NHẬP LIỆU ================= */
function row(label, html) {
    return `
        <div class="info-row">
            <b>${label}</b>
            <div>${html}</div>
        </div>
    `;
}

/* ================= 6. VALIDATE DỮ LIỆU ================= */
function validateAll(mode) {
    let ok = true;
    document.querySelectorAll(".error").forEach(e => e.innerText = "");

    const ten = document.getElementById("ten_nxb").value.trim();
    const sdt = document.getElementById("dien_thoai").value.trim();
    const mail = document.getElementById("email").value.trim();

    if (!ten) {
        document.getElementById("e_ten_nxb").innerText = "Tên NXB không được để trống";
        ok = false;
    }

    if (sdt && !/^\d{9,11}$/.test(sdt)) {
        document.getElementById("e_dien_thoai").innerText = "SĐT phải từ 9-11 chữ số";
        ok = false;
    }

    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        document.getElementById("e_email").innerText = "Email không đúng định dạng";
        ok = false;
    }

    // Nếu là UPDATE thì chỉ bật nút khi có thay đổi, INSERT thì bật khi dữ liệu hợp lệ
    const btnAction = document.getElementById("btnAction");
    if (mode === "UPDATE") {
        btnAction.disabled = !(ok && isChanged());
    } else {
        btnAction.disabled = !ok;
    }
}

function isChanged() {
    return (
        document.getElementById("ten_nxb").value.trim() !== originalData.ten_nxb ||
        document.getElementById("dien_thoai").value.trim() !== (originalData.dien_thoai ?? "") ||
        document.getElementById("email").value.trim() !== (originalData.email ?? "") ||
        document.getElementById("dia_chi").value.trim() !== (originalData.dia_chi ?? "")
    );
}

/* ================= 7. NGHIỆP VỤ (CREATE / UPDATE) ================= */
async function create() {
    const data = getFormData();
    try {
        const res = await fetch(`${API_URL}/nhaxuatban`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert("Thêm nhà xuất bản mới thành công!");
            window.location.href = "../trangchu/trangchu.html";
        }
    } catch (e) { console.error(e); }
}

async function update() {
    const data = getFormData();
    try {
        const res = await fetch(`${API_URL}/nhaxuatban/${ma_nxb}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert("Cập nhật thành công!");
            location.reload();
        }
    } catch (e) { console.error(e); }
}

function getFormData() {
    return {
        ten_nxb: document.getElementById("ten_nxb").value.trim(),
        dien_thoai: document.getElementById("dien_thoai").value.trim(),
        email: document.getElementById("email").value.trim(),
        dia_chi: document.getElementById("dia_chi").value.trim()
    };
}

function goBack() { window.location.href = "../trangchu/trangchu.html"; }