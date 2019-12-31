new IntersectionObserver(
  function(entries) {
    entries[0].isIntersecting
      ? document.body.classList.add("zoom")
      : document.body.classList.remove("zoom");
  },
  {
    rootMargin: "50px",
    threshold: 0
  }
).observe(document.querySelector("footer"));
