import { focusRegistry } from './FocusRegistry';

function getRegion(el) {
  if (el.closest('.sidebar-panel')) return 'sidebar';
  if (el.closest('.top-navbar')) return 'navbar';
  return 'content';
}

function getContainer(el) {
  return el.closest('.section-card-container, .shortcuts-panel, table, form, .modal-content, footer') || el.parentElement;
}

function isVisible(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  
  let parent = el;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    parent = parent.parentElement;
  }
  return true;
}

export const NavigationEngine = {
  getRect(el) {
    return el.getBoundingClientRect();
  },

  navigate(direction, currentElement) {
    const allElements = focusRegistry.getAll().filter(isVisible);
    if (allElements.length === 0) return null;

    if (!currentElement || currentElement === document.body) {
      return allElements[0];
    }

    const currentRegion = getRegion(currentElement);

    if (currentRegion === 'sidebar') {
      const sidebarContainer = currentElement.closest('.sidebar-panel');
      if (sidebarContainer) {
        const visibleItems = Array.from(sidebarContainer.querySelectorAll('.sidebar-link, .submenu-link')).filter(isVisible);
        
        console.log("Sidebar Navigation Graph");
        visibleItems.forEach((item, index) => {
          const parentMenu = item.closest('.space-y-1');
          const parentTitle = parentMenu?.querySelector('.sidebar-link-text')?.textContent?.trim() || '';
          const itemText = item.querySelector('.sidebar-link-text')?.textContent?.trim() || item.textContent?.trim() || '';
          const fullPathName = (parentTitle && parentTitle !== itemText) ? `${parentTitle} > ${itemText}` : itemText;
          console.log(`${index + 1} ${fullPathName}`);
        });

        const currentIndex = visibleItems.indexOf(currentElement);
        if (currentIndex !== -1) {
          const isParent = currentElement.querySelectorAll('svg').length > 1;
          const isExpanded = currentElement.nextElementSibling?.classList.contains('submenu-container');

          if (direction === 'down') {
            return visibleItems[Math.min(currentIndex + 1, visibleItems.length - 1)];
          }
          if (direction === 'up') {
            return visibleItems[Math.max(currentIndex - 1, 0)];
          }
          if (direction === 'right') {
            if (isParent) {
              if (!isExpanded) {
                currentElement.click();
                return currentElement;
              } else {
                return visibleItems[Math.min(currentIndex + 1, visibleItems.length - 1)];
              }
            }
          }
          if (direction === 'left') {
            if (isParent && isExpanded) {
              currentElement.click();
              return currentElement;
            } else {
              const subContainer = currentElement.closest('.submenu-container');
              if (subContainer) {
                const parentItem = subContainer.previousElementSibling;
                if (parentItem) {
                  return parentItem;
                }
              } else {
                return visibleItems[Math.max(currentIndex - 1, 0)];
              }
            }
          }
        }
      }
    }

    // Traps focus inside active navigation region (Content, Navbar, or Sidebar)
    const regionElements = allElements.filter(el => getRegion(el) === currentRegion);
    if (regionElements.length === 0) return null;

    const currentContainer = getContainer(currentElement);
    const containerElements = regionElements.filter(el => getContainer(el) === currentContainer);

    const currentRect = this.getRect(currentElement);
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2
    };

    // 1. Local container grid navigation
    if (containerElements.length > 1) {
      const rows = [];
      containerElements.forEach(el => {
        const rect = this.getRect(el);
        const cy = rect.top + rect.height / 2;
        const cx = rect.left + rect.width / 2;
        
        let foundRow = rows.find(r => Math.abs(r.y - cy) < 32);
        if (foundRow) {
          foundRow.elements.push({ el, cx, cy });
        } else {
          rows.push({
            y: cy,
            elements: [{ el, cx, cy }]
          });
        }
      });

      rows.sort((a, b) => a.y - b.y);
      rows.forEach(r => {
        r.elements.sort((a, b) => a.cx - b.cx);
      });

      let curRowIdx = -1;
      let curColIdx = -1;
      for (let r = 0; r < rows.length; r++) {
        const cIdx = rows[r].elements.findIndex(item => item.el === currentElement);
        if (cIdx !== -1) {
          curRowIdx = r;
          curColIdx = cIdx;
          break;
        }
      }

      if (curRowIdx !== -1 && curColIdx !== -1) {
        if (direction === 'right' && curColIdx < rows[curRowIdx].elements.length - 1) {
          return rows[curRowIdx].elements[curColIdx + 1].el;
        }
        if (direction === 'left' && curColIdx > 0) {
          return rows[curRowIdx].elements[curColIdx - 1].el;
        }
        if (direction === 'down' && curRowIdx < rows.length - 1) {
          const nextRow = rows[curRowIdx + 1].elements;
          let closestEl = nextRow[0].el;
          let minDx = Math.abs(nextRow[0].cx - currentCenter.x);
          nextRow.forEach(item => {
            const dx = Math.abs(item.cx - currentCenter.x);
            if (dx < minDx) {
              minDx = dx;
              closestEl = item.el;
            }
          });
          return closestEl;
        }
        if (direction === 'up' && curRowIdx > 0) {
          const prevRow = rows[curRowIdx - 1].elements;
          let closestEl = prevRow[0].el;
          let minDx = Math.abs(prevRow[0].cx - currentCenter.x);
          prevRow.forEach(item => {
            const dx = Math.abs(item.cx - currentCenter.x);
            if (dx < minDx) {
              minDx = dx;
              closestEl = item.el;
            }
          });
          return closestEl;
        }
      }
    }

    const candidatesLog = [];
    let bestCandidate = null;
    let minScore = Infinity;

    regionElements.forEach(candidate => {
      if (candidate === currentElement) return;
      if (getContainer(candidate) === currentContainer && containerElements.length > 1) return;

      const candRect = this.getRect(candidate);
      const candCenter = {
        x: candRect.left + candRect.width / 2,
        y: candRect.top + candRect.height / 2
      };

      const dx = candCenter.x - currentCenter.x;
      const dy = candCenter.y - currentCenter.y;

      let isCandidate = false;
      let angleDiff = 0;

      if (direction === 'right') {
        isCandidate = candCenter.x > currentCenter.x + 2;
        angleDiff = Math.abs(Math.atan2(dy, dx));
      } else if (direction === 'left') {
        isCandidate = candCenter.x < currentCenter.x - 2;
        angleDiff = Math.abs(Math.atan2(dy, -dx));
      } else if (direction === 'down') {
        isCandidate = candCenter.y > currentCenter.y + 2;
        angleDiff = Math.abs(Math.atan2(dx, dy));
      } else if (direction === 'up') {
        isCandidate = candCenter.y < currentCenter.y - 2;
        angleDiff = Math.abs(Math.atan2(dx, -dy));
      }

      if (!isCandidate) return;

      const dist = Math.sqrt(dx * dx + dy * dy);
      let score = dist * (1 + 2 * angleDiff);

      candidatesLog.push({
        element: candidate.tagName + (candidate.className ? `.${candidate.className.split(' ').join('.')}` : '') + (candidate.textContent ? ` (${candidate.textContent.substring(0, 30).trim()})` : ''),
        score,
        distance: dist,
        angleDiff
      });

      if (score < minScore) {
        minScore = score;
        bestCandidate = candidate;
      }
    });

    console.log("Spatial Navigation Debug");
    console.log("Focused Element:", currentElement.tagName + (currentElement.className ? `.${currentElement.className.split(' ').join('.')}` : '') + (currentElement.textContent ? ` (${currentElement.textContent.substring(0, 30).trim()})` : ''));
    console.log("Candidate Elements:", candidatesLog);
    console.log("Chosen Target:", bestCandidate ? (bestCandidate.tagName + (bestCandidate.className ? `.${bestCandidate.className.split(' ').join('.')}` : '') + (bestCandidate.textContent ? ` (${bestCandidate.textContent.substring(0, 30).trim()})` : '')) : "None");
    console.log("Reason Selected:", bestCandidate ? `Nearest candidate in direction ${direction} with lowest score of ${minScore.toFixed(2)}` : "No valid candidates in this direction");

    return bestCandidate;
  }
};
