import React, { useRef, useEffect } from 'react';
import useCommandPalette from '../../hooks/useCommandPalette';
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import '../../styles/CommandPalette.css';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const {
    isOpen: activeOpen,
    setIsOpen,
    query,
    setQuery,
    activeIndex,
    filteredItems,
    handleSelect,
    handleKeyDown,
  } = useCommandPalette(onNavigate);

  const inputRef = useRef(null);

  // Sync open states from parent trigger or shortcut hook
  useEffect(() => {
    if (isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!activeOpen) {
      onClose();
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [activeOpen]);

  if (!activeOpen) return null;

  // Group items by category for visual sections
  const categories = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Flattened array list to match activeIndex index correctly
  let globalCounter = 0;

  return (
    <div className="cmd-palette-overlay" onClick={onClose}>
      <div 
        className="cmd-palette-box" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-palette-header">
          <Search className="cmd-palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder="Type to search modules, pages, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="cmd-palette-esc-badge">ESC</span>
        </div>

        <div className="cmd-palette-results">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] font-semibold">
              No results found for "{query}".
            </div>
          ) : (
            Object.keys(categories).map((catName) => (
              <div key={catName}>
                <div className="cmd-palette-section-title">{catName}</div>
                <div className="cmd-palette-list">
                  {categories[catName].map((item) => {
                    const isFocused = globalCounter === activeIndex;
                    const currentIndex = globalCounter;
                    globalCounter++;
                    
                    return (
                      <div
                        key={item.id}
                        className={`cmd-palette-item ${isFocused ? 'cmd-palette-item-focused' : ''}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => {}}
                      >
                        <div className="cmd-palette-item-left">
                          <span className="cmd-palette-item-icon">
                            <Search size={14} />
                          </span>
                          <div className="cmd-palette-item-text">
                            <span className="cmd-palette-item-title">{item.title}</span>
                            <span className="cmd-palette-item-subtitle">{item.subtitle}</span>
                          </div>
                        </div>
                        {isFocused && (
                          <span className="cmd-palette-shortcut">
                            <CornerDownLeft size={10} />
                            <kbd className="cmd-kbd">Enter</kbd>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cmd-palette-footer">
          <div className="cmd-help-item">
            <kbd className="cmd-kbd"><ArrowUp size={8} /></kbd>
            <kbd className="cmd-kbd"><ArrowDown size={8} /></kbd>
            <span>to navigate</span>
          </div>
          <div className="cmd-help-item">
            <kbd className="cmd-kbd">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
