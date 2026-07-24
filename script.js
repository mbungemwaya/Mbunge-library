// ============================================
// PDF COVER EXTRACTOR
// ============================================

// Load PDF.js library
const pdfjsLib = window.pdfjsLib;
if (pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

document.addEventListener('DOMContentLoaded', async function() {
  const bookCards = document.querySelectorAll('.book-card');
  
  // Map of book titles to their PDF file paths in the repository
  const bookPDFs = {
    'Rich Dad Poor Dad': 'rich-dad-poor-dad.pdf',
    'Think and Grow Rich': 'THINK_AND_GROW_RICH_-_Napoleon_Hill.pdf',
    'Understanding Your Potential': 'understanding_your_potential_-_myles_munroe.pdf',
    'Rediscovering the Kingdom': 'Rediscovering%20the%20Kingdom%20-%20Myles%20Munroe.pdf',
    'Start with Why': 'Start%20With%20Why%20-%20Simon%20Sinek.pdf',
    'Atomic Habits': 'Atomic%20habits%20(%20PDFDrive%20).pdf'
  };
  
  for (const card of bookCards) {
    const titleElement = card.querySelector('.book-title');
    const coverBg = card.querySelector('.book-cover-bg');
    
    if (titleElement && coverBg) {
      const bookTitle = titleElement.textContent.trim();
      const pdfFile = bookPDFs[bookTitle];
      
      if (pdfFile && pdfjsLib) {
        try {
          // Extract first page from PDF
          await extractPDFCover(pdfFile, coverBg, bookTitle);
        } catch (error) {
          console.error(`Error loading PDF cover for ${bookTitle}:`, error);
          // Fallback to placeholder
          setFallbackCover(coverBg);
        }
      } else {
        setFallbackCover(coverBg);
      }
    }
  }
});

async function extractPDFCover(pdfPath, coverBg, bookTitle) {
  try {
    // Construct full URL to the PDF file
    const pdfUrl = `./${pdfPath}`;
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    
    // Get the first page
    const page = await pdf.getPage(1);
    
    // Set up the canvas
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Render the page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to image and set as background
    const imageData = canvas.toDataURL('image/png');
    coverBg.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${imageData}')`;
    coverBg.style.backgroundSize = 'cover';
    coverBg.style.backgroundPosition = 'center';
    
  } catch (error) {
    console.error(`Failed to extract PDF cover for ${bookTitle}:`, error);
    setFallbackCover(coverBg);
  }
}

function setFallbackCover(coverBg) {
  // Fallback to gradient if PDF extraction fails
  coverBg.style.background = `linear-gradient(135deg, #2dd4bf, #06b6d4)`;
  coverBg.style.display = 'flex';
  coverBg.style.alignItems = 'center';
  coverBg.style.justifyContent = 'center';
  coverBg.style.fontSize = '3rem';
}

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
