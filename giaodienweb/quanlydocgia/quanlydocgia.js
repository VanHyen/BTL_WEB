const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const ma_dg = params.get("ma_dg");

// 1. KHỞI TẠO TRANG
if (ma_dg === "new") {
    document.getElementById("status-badge").style.display = "none";
    document.getElementById("history-area").style.display = "none";
} else if (ma_dg) {
    loadReaderData(Number(ma_dg));
    loadBorrowHistory(Number(ma_dg)); //
    document.getElementById("btn_delete").style.display = "block";
}

/* ================= 2. TẢI THÔNG TIN ĐỘC GIẢ ================= */
async function loadReaderData(id) {
    try {
        const res = await fetch(`${API_URL}/docgia/${id}`);
        const result = await res.json();
        const d = result.data ?? result;

        document.getElementById("ma_dg").value = d.ma_dg;
        document.getElementById("ten_dg").value = d.ten_dg;
        document.getElementById("dien_thoai").value = d.dien_thoai;
        document.getElementById("email").value = d.email || "";
        document.getElementById("dia_chi").value = d.dia_chi;
    } catch (e) { console.error("Lỗi tải độc giả:", e); }
}

/* ================= 3. TẢI LỊCH SỬ MƯỢN SÁCH ================= */
async function loadBorrowHistory(id) {
    try {
        // Giả sử API trả về danh sách phiếu mượn của độc giả này
        const res = await fetch(`${API_URL}/phieumuon?ma_dg=${id}`);
        const list = await res.json();
        const body = document.getElementById("history-body");
        body.innerHTML = "";

        if (list.length === 0) {
            body.innerHTML = "<tr><td colspan='6'>Chưa có lịch sử mượn sách.</td></tr>";
            return;
        }

        list.forEach((item, index) => {
            body.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><b>#PM${item.ma_pm}</b></td>
                    <td>${item.ngay_muon.split('T')[0]}</td>
                    <td>${item.so_luong_sach || 0} quyển</td>
                    <td>${Number(item.tong_tien_coc).toLocaleString()} đ</td>
                    <td><a href="../quanlyphieumuon/quanlyphieumuon.html?ma_pm=${item.ma_pm}" style="color:blue">Xem</a></td>
                </tr>
            `;
        });
    } catch (e) { console.error("Lỗi tải lịch sử:", e); }
}

/* ================= 4. LƯU / CẬP NHẬT ================= */
async function saveReader() {
    const data = {
        ten_dg: document.getElementById("ten_dg").value.trim(),
        dien_thoai: document.getElementById("dien_thoai").value.trim(),
        email: document.getElementById("email").value.trim(),
        dia_chi: document.getElementById("dia_chi").value.trim()
    };

    if (!data.ten_dg || !data.dien_thoai) return alert("Vui lòng nhập tên và SĐT!");

    const method = (ma_dg === "new") ? "POST" : "PUT";
    const url = (ma_dg === "new") ? `${API_URL}/docgia` : `${API_URL}/docgia/${ma_dg}`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Đã lưu thông tin độc giả!");
            window.location.href = "../trangchu/trangchu.html";
        }
    } catch (e) { console.error(e); }
}

/* ================= 5. XÓA ĐỘC GIẢ ================= */
async function removeReader() {
    if (confirm("Xóa độc giả này sẽ ảnh hưởng đến lịch sử mượn sách. Bạn chắc chắn?")) {
        await fetch(`${API_URL}/docgia/${ma_dg}`, { method: "DELETE" });
        window.location.href = "../trangchu/trangchu.html";
    }
}

function goBack() { window.history.back(); }