// ============================================
// BOOK COVER IMAGE LOADER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const bookCards = document.querySelectorAll('.book-card');
  
  // Map of book titles to cover image URLs
  const bookCovers = {
    'Rich Dad Poor Dad': 'https://images-na.ssl-images-amazon.com/images/P/B00YJKNQXY.01.L.jpg',
    'Think and Grow Rich': 'https://images-na.ssl-images-amazon.com/images/P/1585424335.01.L.jpg',
    'The Bible': 'https://images-na.ssl-images-amazon.com/images/P/B007ZPUBEM.01.L.jpg',
    'Understanding Your Potential': 'https://images-na.ssl-images-amazon.com/images/P/0768403502.01.L.jpg',
    'Rediscovering the Kingdom': 'https://images-na.ssl-images-amazon.com/images/P/1938539109.01.L.jpg',
    'The Psychology of Money': 'https://images-na.ssl-images-amazon.com/images/P/0857197290.01.L.jpg',
    'Start with Why': 'https://images-na.ssl-images-amazon.com/images/P/1591846447.01.L.jpg',
    'Atomic Habits': 'https://images-na.ssl-images-amazon.com/images/P/0735211299.01.L.jpg'
  };
  
  bookCards.forEach(card => {
    const titleElement = card.querySelector('.book-title');
    const coverBg = card.querySelector('.book-cover-bg');
    
    if (titleElement && coverBg) {
      const bookTitle = titleElement.textContent.trim();
      const coverUrl = bookCovers[bookTitle];
      
      if (coverUrl) {
        // Set background image with fallback color
        coverBg.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${coverUrl}')`;
        coverBg.style.backgroundSize = 'cover';
        coverBg.style.backgroundPosition = 'center';
      } else {
        // Fallback to gradient if no cover found
        coverBg.style.background = `linear-gradient(135deg, var(--secondary-color), rgba(26, 95, 71, 0.5))`;
      }
    }
  });
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const searchInput = document.getElementById("search");
const bookList = document.getElementById("bookList");
const noResultsMsg = document.getElementById("noResults");

searchInput.addEventListener("keyup", function () {
  filterBooks();
});

searchInput.addEventListener("input", function () {
  filterBooks();
});

function filterBooks() {
  let input = searchInput.value.toLowerCase();
  let books = document.getElementsByClassName("book-card");
  let visibleCount = 0;

  for (let i = 0; i < books.length; i++) {
    let bookTitle = books[i].querySelector(".book-title").innerText.toLowerCase();
    let bookCategory = books[i].querySelector(".book-category").innerText.toLowerCase();
    let bookDescription = books[i].querySelector(".book-description").innerText.toLowerCase();
    
    // Search across title, category, and description
    if (
      bookTitle.includes(input) ||
      bookCategory.includes(input) ||
      bookDescription.includes(input) ||
      input === ""
    ) {
      books[i].style.display = "flex";
      books[i].style.animation = "slideUp 0.3s ease";
      visibleCount++;
    } else {
      books[i].style.display = "none";
    }
  }

  // Show/hide "no results" message
  if (visibleCount === 0 && input !== "") {
    noResultsMsg.style.display = "block";
  } else {
    noResultsMsg.style.display = "none";
  }
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ============================================
// CATEGORY CARD INTERACTION
// ============================================

const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
  card.addEventListener('click', function () {
    const categoryTitle = this.querySelector('h3').innerText;
    // Auto-fill search with category name
    searchInput.value = categoryTitle;
    filterBooks();
    
    // Smooth scroll to books section
    setTimeout(() => {
      document.getElementById('books').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  });

  // Keyboard support for category cards
  card.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
});

// ============================================
// MOBILE MENU BEHAVIOR (Optional Enhancement)
// ============================================

// Add scroll position preservation
window.addEventListener('beforeunload', function () {
  sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function () {
  const scrollPosition = sessionStorage.getItem('scrollPosition');
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    sessionStorage.removeItem('scrollPosition');
  }
});

// ============================================
// PERFORMANCE - LAZY LOADING SUPPORT
// ============================================

if ('IntersectionObserver' in window) {
  const bookCards = document.querySelectorAll('.book-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  bookCards.forEach(card => observer.observe(card));
}
