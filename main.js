// Add debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function scanComments() {
  // Check if required functions and variables are available
  if (typeof calculateSpamScore !== 'function' || 
      typeof blurComment !== 'function' || 
      typeof showScanningUI !== 'function') {
    console.warn('Required functions not available, skipping scan');
    return;
  }

  const commentsToScan = Array.from(
    document.querySelectorAll("ytd-comment-thread-renderer #content-text:not([data-scanned])")
  );
  
  if (commentsToScan.length === 0) return;

  console.log(`Scanning ${commentsToScan.length} new comments...`);
  showScanningUI(true);

  // Process comments in batches to avoid blocking the UI
  const batchSize = 10;
  const totalComments = commentsToScan.length;
  
  for (let i = 0; i < totalComments; i += batchSize) {
    const batch = commentsToScan.slice(i, i + batchSize);
    
    // Process batch
    for (let j = 0; j < batch.length; j++) {
      const el = batch[j];
      const currentIndex = i + j;
      
      try {
        el.dataset.scanned = "true";
        if (typeof stats !== 'undefined') {
          stats.scanned++;
        }

        const rawText = el.textContent?.trim();
        const authorElement = el.closest("#comment")?.querySelector("#author-text");
        const author = authorElement?.textContent?.trim();

        if (!rawText || !author) continue;

        // Check whitelist/blacklist
        if (typeof whitelistedAuthors !== 'undefined' && whitelistedAuthors.has(author)) {
          continue;
        }
        
        if (typeof spammerAuthors !== 'undefined' && spammerAuthors.has(author)) {
          blurComment(el, 95);
          if (typeof stats !== 'undefined') {
            stats.spam++;
          }
          continue;
        }

        // Skip very short comments unless they contain gambling keywords
        if (rawText.length < 15 && !/(slot|gacor|jp|bet|casino|judi)/i.test(rawText)) {
          continue;
        }

        // Check cache
        const cacheKey = `${author}:${rawText.slice(0, 50)}`;
        let cachedResult;
        
        if (typeof commentCache !== 'undefined') {
          cachedResult = commentCache.get(cacheKey);
        }
        
        if (cachedResult) {
          if (cachedResult.isSpam) {
            blurComment(el, cachedResult.confidence);
            if (typeof spammerAuthors !== 'undefined') {
              spammerAuthors.add(author);
            }
            if (typeof stats !== 'undefined') {
              stats.spam++;
            }
          }
          continue;
        }

        // Calculate spam score
        const spamScore = calculateSpamScore(rawText, author);
        const isSpam = spamScore >= 65;

        // Cache result
        if (typeof commentCache !== 'undefined') {
          commentCache.set(cacheKey, { isSpam, confidence: spamScore });
        }

        if (isSpam) {
          if (typeof stats !== 'undefined') {
            stats.spam++;
          }
          blurComment(el, spamScore);
          if (typeof spammerAuthors !== 'undefined') {
            spammerAuthors.add(author);
          }
        } else if (spamScore < 10) {
          if (typeof whitelistedAuthors !== 'undefined') {
            whitelistedAuthors.add(author);
          }
        }

        // Update progress bar
        if (typeof uiElements !== 'undefined' && uiElements.progressBar) {
          const progress = ((currentIndex + 1) / totalComments) * 100;
          uiElements.progressBar.style.width = `${progress}%`;
        }
        
      } catch (error) {
        console.error('Error processing comment:', error);
      }
    }
    
    // Yield control to browser between batches
    if (i + batchSize < totalComments) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  showScanningUI(false);
  console.log('Scan completed');
}

// Debounced scan function
const debouncedScan = debounce(scanComments, 500);

function initialize() {
  console.log('🛡️ Judol Detector initializing...');
  
  // Check if required functions exist
  if (typeof createUIPanels !== 'function') {
    console.warn('createUIPanels function not available');
  } else {
    createUIPanels();
  }

  // Set up mutation observer with better performance
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain comments
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            if (node.querySelector && 
                (node.querySelector('ytd-comment-thread-renderer') || 
                 node.matches('ytd-comment-thread-renderer'))) {
              shouldScan = true;
              break;
            }
          }
        }
      }
      if (shouldScan) break;
    }
    
    if (shouldScan) {
      clearTimeout(window.judolScanTimeout);
      window.judolScanTimeout = setTimeout(debouncedScan, 500);
    }
  });

  // Observe with more specific options
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: false,
    characterData: false
  });

  // Event listeners
  window.addEventListener("load", () => {
    console.log('Page loaded, starting initial scan...');
    scanComments();
  });

  // Throttled scroll handler
  let scrollTimeout;
  let isScrolling = false;
  
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        debouncedScan();
        isScrolling = false;
      }, 1000);
    }
  }, { passive: true });

  // Page visibility change handler
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Page became visible, scan for new comments
      setTimeout(debouncedScan, 1000);
    }
  });

  console.log("🛡️ Judol Detector v15 'No Stats UI' AKTIF.");
  
  // Initial scan
  if (document.readyState === 'complete') {
    scanComments();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}