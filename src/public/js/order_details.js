function viewProduct(productId) {
  window.location.href = `/product/${productId}`;
} 

function getFormData(form) {
  const stars = form.querySelectorAll(".star");
  const ratingInput = form.querySelector("input[name='rating']");
  const commentInput = form.querySelector("textarea[name='comment']");
  const productId = form.dataset.productId;
  const rating = parseInt(ratingInput.value);
  const comment = commentInput.value;

  const formData = {
    product_id: productId,
    rating: rating,
    comment: comment
  };

  console.log(formData);

  return formData;
}

async function handleReviewSubmit(form) {
  const data = getFormData(form); 

  try {
    const res = await fetch("/api/reviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data) 
    });

    if (res.ok) {
      alert("Review added successfully!");
      window.location.reload();
    } else {
      const errorData = await res.json();
      alert(errorData.message || "Failed to submit review");
    }
  } catch (err) {
    console.error("Error while submitting review:", err);
    alert("Error while submitting review");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".reviewForm");

  forms.forEach((form) => {
    const stars = form.querySelectorAll(".star");
    const ratingInput = form.querySelector("input[name='rating']");

    stars.forEach(star => {
      star.addEventListener("click", () => {
        const value = parseInt(star.dataset.value);
        ratingInput.value = value;

        stars.forEach((s, index) => {
          s.style.color = (index < value) ? "gold" : "gray";
        });
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleReviewSubmit(form);
    });
  });
});
