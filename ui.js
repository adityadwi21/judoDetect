// Initialize stats object
let stats = { scanned: 0, spam: 0, whitelisted: 0 };
let uiElements = {};

function createUIPanels() {
  // Remove existing UI elements if they exist
  const existingProgress = document.querySelector('.judol-progress');
  if (existingProgress) {
    existingProgress.remove();
  }

  // Create progress container
  const progressContainer = document.createElement("div");
  progressContainer.className = "judol-progress";
  progressContainer.style.display = "none";
  progressContainer.style.position = "fixed";
  progressContainer.style.top = "0";
  progressContainer.style.left = "0";
  progressContainer.style.right = "0";
  progressContainer.style.height = "3px";
  progressContainer.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
  progressContainer.style.zIndex = "10002";
  
  const progressBar = document.createElement("div");
  progressBar.className = "judol-progress-bar";
  progressBar.style.height = "100%";
  progressBar.style.background = "linear-gradient(90deg, #3b82f6, #10b981)";
  progressBar.style.transition = "width 0.3s ease";
  progressBar.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.5)";
  progressBar.style.width = "0%";
  
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);
  
  uiElements = { progressContainer, progressBar };
  
  console.log('UI panels created');
}

function showScanningUI(isScanning) {
  if (!uiElements.progressContainer) {
    console.warn('Progress container not found');
    return;
  }
  
  if (isScanning) {
    uiElements.progressContainer.style.display = "block";
    uiElements.progressBar.style.width = "0%";
  } else {
    uiElements.progressBar.style.width = "100%";
    setTimeout(() => {
      if (uiElements.progressContainer) {
        uiElements.progressContainer.style.display = "none";
      }
    }, 500);
  }
}

function getSeverityInfo(confidence) {
  if (confidence >= 90) {
    return {
      severity: "high-severity",
      confidenceClass: "confidence-high",
      blurAmount: "12px",
      color: "#ef4444"
    };
  } else if (confidence >= 75) {
    return {
      severity: "medium-severity", 
      confidenceClass: "confidence-medium",
      blurAmount: "8px",
      color: "#f59e0b"
    };
  } else {
    return {
      severity: "low-severity",
      confidenceClass: "confidence-low", 
      blurAmount: "5px",
      color: "#eab308"
    };
  }
}

function blurComment(el, confidence) {
  if (!el) {
    console.warn('Element not provided to blurComment');
    return;
  }
  
  // Avoid double-processing
  if (el.dataset.judol === "true") {
    return;
  }
  
  const severityInfo = getSeverityInfo(confidence);
  
  // Add blur effect
  el.classList.add("judol-blur", severityInfo.severity);
  el.dataset.judol = "true";
  el.dataset.hidden = "true";
  
  // Apply initial blur
  el.style.filter = `blur(${severityInfo.blurAmount})`;
  el.style.transition = "filter 0.3s ease";

  // Create warning element
  const warning = document.createElement("div");
  warning.className = `judol-warning ${severityInfo.severity}`;
  warning.style.cssText = `
    margin: 8px 0;
    padding: 12px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    border: 2px solid ${severityInfo.color};
    background: ${getBackgroundGradient(severityInfo.severity)};
    animation: slideIn 0.3s ease-out;
  `;
  
  if (severityInfo.severity === 'high-severity') {
    warning.style.animation = 'warningPulse 1s infinite, slideIn 0.3s ease-out';
  }
  
  warning.innerHTML = `
    <div style="display:flex; align-items:center; font-weight:bold; margin-bottom: 4px; color: black;">
      🚨 Komentar ini berisiko (${Math.round(confidence)}%)
      <span class="confidence-indicator ${severityInfo.confidenceClass}" style="
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-left: 8px;
        background: ${severityInfo.color};
        animation: blink 1.5s infinite;
      "></span>
    </div>
    <a class="toggle-comment" style="
      display: inline-block;
      margin-top: 6px;
      padding: 4px 8px;
      border: 1px solid #cbd5e0;
      border-radius: 4px;
      text-decoration: none;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #f8f9fa;
      color: #2d3748;
    ">Tampilkan Komentar</a>
  `;
  
  // Insert warning after the comment
  try {
    el.parentNode.insertBefore(warning, el.nextSibling);
  } catch (error) {
    console.error('Error inserting warning:', error);
    return;
  }

  // Add toggle functionality
  const toggleButton = warning.querySelector(".toggle-comment");
  if (toggleButton) {
    // Add hover effect
    toggleButton.addEventListener('mouseenter', () => {
      toggleButton.style.transform = 'translateY(-1px)';
      toggleButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
      toggleButton.style.transform = 'translateY(0)';
      toggleButton.style.boxShadow = 'none';
    });
    
    // Add click handler
    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = el.dataset.hidden === "true";
      
      if (isHidden) {
        el.style.filter = "none";
        el.dataset.hidden = "false";
        toggleButton.textContent = "Sembunyikan Komentar";
      } else {
        el.style.filter = `blur(${severityInfo.blurAmount})`;
        el.dataset.hidden = "true";
        toggleButton.textContent = "Tampilkan Komentar";
      }
    });
  }
}

function getBackgroundGradient(severity) {
  switch(severity) {
    case 'high-severity':
      return 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
    case 'medium-severity':
      return 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)';
    case 'low-severity':
      return 'linear-gradient(135deg, #fefce8 0%, #fde68a 100%)';
    default:
      return 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
  }
}

// Add required CSS animations if not already present
function addRequiredStyles() {
  if (document.querySelector('#judol-detector-styles')) {
    return; // Already added
  }
  
  const style = document.createElement('style');
  style.id = 'judol-detector-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes warningPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }
    
    @keyframes blink {
      0%, 50% {
        opacity: 1;
      }
      51%, 100% {
        opacity: 0.3;
      }
    }
    
    .judol-blur {
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }
    
    .judol-blur:hover {
      opacity: 0.8;
    }
    
    @media (prefers-color-scheme: dark) {
      .judol-warning {
        background: linear-gradient(135deg, #1f1f1f 0%, #2d1b1b 100%) !important;
        color: #f9fafb !important;
      }
      .toggle-comment {
        background: #374151 !important;
        border-color: #4b5563 !important;
        color: #f9fafb !important;
      }
      .toggle-comment:hover {
        background: #4b5563 !important;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize styles when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addRequiredStyles);
} else {
  addRequiredStyles();
}