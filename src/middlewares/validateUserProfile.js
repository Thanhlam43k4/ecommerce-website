const validateUserProfile = (req, res, next) => {
  const { username, phone, address, city, postalCode } = req.body;
  let errors = [];



  // Kiểm tra số điện thoại (10-15 chữ số)
  if (!/^\d{10,15}$/.test(phone)) {
    errors.push("Số điện thoại phải có từ 10 đến 15 chữ số.");
  }

  // Kiểm tra địa chỉ, thành phố, mã bưu điện không rỗng
  if (!address.trim()) {
    errors.push("Địa chỉ không được để trống.");
  }

  if (!city.trim()) {
    errors.push("Thành phố không được để trống.");
  }

  if (!postalCode.trim() || isNaN(postalCode)) {
    errors.push("Mã bưu điện phải là số và không được để trống.");
  }

  // Nếu có lỗi, trả về phản hồi JSON hoặc render trang với thông báo lỗi
  if (errors.length > 0) {
    res.locals.errorMessage = errors.join(" ");
    return res.render("userprofile", { user: req.body }); // Render lại trang với errorMessage
  }

  next(); // Nếu hợp lệ, tiếp tục xử lý request
};

module.exports = validateUserProfile;
