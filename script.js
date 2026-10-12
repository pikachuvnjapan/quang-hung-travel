const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Mở menu");
  });
});

const bookingForm = document.querySelector("#booking-form");
const destinationField = bookingForm.elements.destination;
const otherRouteWrap = document.querySelector("#other-route-wrap");
const otherDestinationField = bookingForm.elements.otherDestination;
const resultPanel = document.querySelector("#booking-result");
const messagePreview = document.querySelector("#message-preview");
const copyStatus = document.querySelector("#copy-status");

destinationField.addEventListener("change", () => {
  const needsCustomRoute = destinationField.value === "other";
  otherRouteWrap.hidden = !needsCustomRoute;
  otherDestinationField.required = needsCustomRoute;
  if (!needsCustomRoute) otherDestinationField.value = "";
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(bookingForm);
  const rawDate = values.get("date");
  let tripDate = "Chưa chọn";
  if (rawDate) {
    const [year, month, day] = rawDate.split("-").map(Number);
    tripDate = new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  }

  const route = values.get("destination") === "other"
    ? values.get("otherDestination").trim()
    : values.get("destination");
  const note = values.get("note").trim() || "Không có";
  const message = [
    "YÊU CẦU ĐẶT XE — QUANG HÙNG TRAVEL",
    "Họ tên: " + values.get("name").trim(),
    "Số điện thoại: " + values.get("phone").trim(),
    "Điểm đón: " + values.get("pickup").trim(),
    "Điểm đến: " + route,
    "Ngày đi: " + tripDate,
    "Giờ đón: " + (values.get("time") || "Chưa chọn"),
    "Ghi chú: " + note,
  ].join("\n");

  messagePreview.value = message;
  copyStatus.textContent = "";
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelector("#copy-request").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(messagePreview.value);
    copyStatus.textContent = "Đã sao chép. Mở Zalo và dán nội dung để gửi.";
  } catch {
    messagePreview.focus();
    messagePreview.select();
    const copied = document.execCommand("copy");
    copyStatus.textContent = copied
      ? "Đã sao chép. Mở Zalo và dán nội dung để gửi."
      : "Hãy chọn và sao chép nội dung trong khung.";
  }
});

const dateField = bookingForm.elements.date;
const now = new Date();
const localToday = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");
dateField.min = localToday;
document.querySelector("#current-year").textContent = String(now.getFullYear());
