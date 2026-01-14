const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const ma_sach = params.get("ma_sach"); 

let originalData = null;

// Khởi tạo trang dựa trên tham số URL
if (ma_sach === "new") {
    renderEmptyForm(); // Trường hợp thêm mới
} else if (ma_sach) {
    loadData(Number(ma_sach)); // Trường hợp xem chi tiết
}

/* ================= 1. HÀM TẢI DỮ LIỆU SÁCH (CHO XEM/SỬA) ================= */
async function loadData(id) {
    try {
        const res = await fetch(`${API_URL}/sach/${id}`);
        const result = await res.json();
        const s = result.data ?? result;
        originalData = { ...s };

        // Hiển thị ảnh bìa
        const img = document.getElementById("product-img");
        img.src = `../Anh/sach/${s.ma_sach}.jpg`;
        img.onerror = () => img.src = "../Anh/default.jpg";

        renderForm(s, "UPDATE"); // Render form với dữ liệu có sẵn
    } catch (error) {
        console.error("Lỗi tải sách:", error);
        document.getElementById("product-info").innerHTML = "<p>Không tìm thấy thông tin sách!</p>";
    }
}

/* ================= 2. HÀM RENDER FORM TRỐNG (CHO THÊM MỚI) ================= */
function renderEmptyForm() {
    // Ẩn/đổi ảnh mặc định khi thêm mới
    const img = document.getElementById("product-img");
    img.src = "../Anh/default.jpg";
    
    const emptyData = {
        ma_sach: "", ten_sach: "", tac_gia: "", 
        ma_the_loai: "", ma_nxb: "", gia_bia: "", 
        gia_nhap: "", so_luong_ton: "", mo_ta: ""
    };
    
    renderForm(emptyData, "INSERT");
}

/* ================= 3. HÀM RENDER FORM CHUNG ================= */
function renderForm(s, mode) {
    const box = document.getElementById("product-info");
    const isEdit = mode === "UPDATE";

    box.innerHTML = `
      <h2>${isEdit ? "CHI TIẾT SÁCH" : "THÊM SÁCH MỚI"}</h2>

      ${row("Mã sách", `<input id="inp_ma_sach" value="${s.ma_sach}" ${isEdit ? "disabled" : "placeholder='Tự động tăng' disabled"}>`)}
      ${row("Tên sách", `<input id="ten_sach" value="${s.ten_sach}"><div class="error" id="e_ten_sach"></div>`)}
      ${row("Tác giả", `<input id="tac_gia" value="${s.tac_gia ?? ""}"><div class="error" id="e_tac_gia"></div>`)}
      ${row("Mã thể loại", `<input id="ma_the_loai" value="${s.ma_the_loai}"><div class="error" id="e_the_loai"></div>`)}
      ${row("Mã NXB", `<input id="ma_nxb" value="${s.ma_nxb}"><div class="error" id="e_nxb"></div>`)}
      ${row("Giá bìa", `<input id="gia_bia" value="${s.gia_bia}"><div class="error" id="e_gia_bia"></div>`)}
      ${row("Giá nhập", `<input id="gia_nhap" value="${s.gia_nhap}"><div class="error" id="e_gia_nhap"></div>`)}
      ${row("Tồn kho", `<input id="so_luong_ton" value="${s.so_luong_ton}"><div class="error" id="e_so_luong"></div>`)}

      <div style="margin-bottom:12px">
        <b>Mô tả sách</b>
        <textarea id="mo_ta" rows="4">${s.mo_ta ?? ""}</textarea>
      </div>

      <div class="action-buttons">
        <button onclick="goBack()"><i class="fas fa-arrow-left"></i> Trở về</button>
        <button id="btnAction" onclick="${isEdit ? "update()" : "create()"}">
            <i class="fas ${isEdit ? "fa-save" : "fa-plus-circle"}"></i> ${isEdit ? "Cập nhật" : "Lưu sách mới"}
        </button>
      </div>
    `;

    // Gán sự kiện Validate
    document.querySelectorAll("#product-info input, #product-info textarea").forEach(i => {
        i.addEventListener("input", () => validateAll(mode));
    });
}

function row(label, html) {
    return `<div class="info-row"><b>${label}</b><div>${html}</div></div>`;
}

/* ================= 4. LOGIC THÊM SÁCH MỚI (CREATE) ================= */
async function create() {
    const data = getFormData();
    try {
        const res = await fetch(`${API_URL}/sach`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Thêm sách mới thành công!");
            window.location.href = "../trangchu/trangchu.html"; // Quay về trang chủ
        } else {
            alert("Lỗi khi thêm sách mới!");
        }
    } catch (e) { console.error(e); }
}

/* ================= 5. LOGIC CẬP NHẬT (UPDATE) ================= */
async function update() {
    const data = getFormData();
    try {
        const res = await fetch(`${API_URL}/sach/${ma_sach}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert("Cập nhật thành công!");
            window.location.reload();
        }
    } catch (e) { console.error(e); }
}

function getFormData() {
    return {
        ten_sach: document.getElementById("ten_sach").value.trim(),
        tac_gia: document.getElementById("tac_gia").value.trim(),
        ma_the_loai: Number(document.getElementById("ma_the_loai").value),
        ma_nxb: Number(document.getElementById("ma_nxb").value),
        gia_bia: Number(document.getElementById("gia_bia").value),
        gia_nhap: Number(document.getElementById("gia_nhap").value),
        so_luong_ton: Number(document.getElementById("so_luong_ton").value),
        mo_ta: document.getElementById("mo_ta").value.trim()
    };
}

function goBack() { window.history.back(); }
/* ================= 3. KIỂM TRA TỒN TẠI (Foreign Key) ================= */
async function checkExists(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch { return false; }
}

/* ================= 4. VALIDATE DỮ LIỆU ================= */
async function validateAll() {
  let ok = true;
  document.querySelectorAll(".error").forEach(e => e.innerText = ""); // Clear lỗi cũ

  const ten = document.getElementById("ten_sach").value.trim();
  const theloai = document.getElementById("ma_the_loai").value.trim();
  const nxb = document.getElementById("ma_nxb").value.trim();
  const giabia = document.getElementById("gia_bia").value.trim();
  const gianhap = document.getElementById("gia_nhap").value.trim();
  const ton = document.getElementById("so_luong_ton").value.trim();

  const err = (id, msg) => { document.getElementById(id).innerText = msg; ok = false; };

  // Kiểm tra tên sách
  if (!ten) err("e_ten_sach", "Tên sách không được để trống");

  // Kiểm tra giá bìa
  if (!/^\d+(\.\d+)?$/.test(giabia) || Number(giabia) <= 0) err("e_gia_bia", "Giá bìa phải là số dương");

  // Kiểm tra giá nhập (phải < giá bìa)
  if (!/^\d+(\.\d+)?$/.test(gianhap) || Number(gianhap) <= 0) {
    err("e_gia_nhap", "Giá nhập phải là số dương");
  } else if (Number(gianhap) >= Number(giabia)) {
    err("e_gia_nhap", "Giá nhập không được lớn hơn hoặc bằng giá bìa");
  }

  // Kiểm tra tồn kho
  if (!/^\d+$/.test(ton) || Number(ton) < 0) err("e_so_luong", "Số lượng tồn không hợp lệ");

  // Kiểm tra mã thể loại và NXB có tồn tại không
  if (ok && theloai) {
    const exists = await checkExists(`${API_URL}/theloai/${theloai}`);
    if (!exists) err("e_the_loai", "Mã thể loại này không tồn tại");
  }

  if (ok && nxb) {
    const exists = await checkExists(`${API_URL}/nhaxuatban/${nxb}`);
    if (!exists) err("e_nxb", "Mã nhà xuất bản không tồn tại");
  }

  // Chỉ bật nút cập nhật khi dữ liệu đúng và có sự thay đổi
  const btnUpdate = document.getElementById("btnUpdate");
  btnUpdate.disabled = !(ok && isChanged());
}

/* ================= 5. KIỂM TRA SỰ THAY ĐỔI ================= */
function isChanged() {
  return (
    document.getElementById("ten_sach").value.trim() !== String(originalData.ten_sach) ||
    document.getElementById("tac_gia").value.trim() !== String(originalData.tac_gia ?? "") ||
    Number(document.getElementById("ma_the_loai").value) !== Number(originalData.ma_the_loai) ||
    Number(document.getElementById("ma_nxb").value) !== Number(originalData.ma_nxb) ||
    Number(document.getElementById("gia_bia").value) !== Number(originalData.gia_bia) ||
    Number(document.getElementById("gia_nhap").value) !== Number(originalData.gia_nhap) ||
    Number(document.getElementById("so_luong_ton").value) !== Number(originalData.so_luong_ton) ||
    document.getElementById("mo_ta").value.trim() !== (originalData.mo_ta ?? "").trim()
  );
}

/* ================= 6. CẬP NHẬT SÁCH ================= */
async function update() {
  const data = {
    ten_sach: document.getElementById("ten_sach").value.trim(),
    tac_gia: document.getElementById("tac_gia").value.trim(),
    ma_the_loai: Number(document.getElementById("ma_the_loai").value),
    ma_nxb: Number(document.getElementById("ma_nxb").value),
    gia_bia: Number(document.getElementById("gia_bia").value),
    gia_nhap: Number(document.getElementById("gia_nhap").value),
    so_luong_ton: Number(document.getElementById("so_luong_ton").value),
    mo_ta: document.getElementById("mo_ta").value.trim()
  };

  try {
    const res = await fetch(`${API_URL}/sach/${ma_sach}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Cập nhật thông tin sách thành công!");
      window.location.reload(); // Tải lại trang để cập nhật originalData mới
    } else {
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại!");
    }
  } catch (error) {
    console.error(error);
    alert("Lỗi kết nối khi cập nhật!");
  }
}

function goBack() { window.history.back(); }