//slide
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelector(".slides");
    const totalSlides = 3; // Số slide gốc (không tính bản sao)
    let index = 1; // Bắt đầu từ slide gốc đầu tiên (sau bản sao cuối)

    // Đặt vị trí ban đầu là slide đầu tiên (sau bản sao cuối)
    slides.style.transform = `translateX(-${index * 100}vw)`;

    function moveToNextSlide() {
        index++;
        slides.style.transition = "transform 0.5s ease-in-out";
        slides.style.transform = `translateX(-${index * 100}vw)`;

        // Khi đến bản sao đầu tiên (index = totalSlides + 1), reset về slide đầu tiên
        if (index === totalSlides + 1) {
            setTimeout(() => {
                slides.style.transition = "none"; // Tắt transition để reset mượt
                index = 1; // Quay về slide đầu tiên (sau bản sao cuối)
                slides.style.transform = `translateX(-${index * 100}vw)`;
            }, 500); // Đợi transition hoàn tất (0.5s)
        }
    }

    // Chuyển slide tự động mỗi 3 giây
    setInterval(moveToNextSlide, 3000);
});