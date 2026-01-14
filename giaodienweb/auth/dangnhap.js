const API_URL = "http://localhost:3000/api";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/dangnhap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        mat_khau: passwordInput.value.trim()
      })
    });

    const result = await res.json();

    if (!result.success) {
      // Hiển thị thông báo lỗi từ server (ví dụ: "Email hoặc mật khẩu không chính xác!")
      alert(result.message || "Đăng nhập thất bại");
      return;
    }

    // LƯU THÔNG TIN VÀO LOCALSTORAGE
    // Lưu id, email và role để sử dụng cho phân quyền ở các trang sau
    localStorage.setItem("user", JSON.stringify(result.data));

    // Chuyển hướng đến trang chủ
    window.location.href = "../trangchu/trangchu.html";
    
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    alert("Không thể kết nối đến máy chủ API");
  }
});