/**
 * SearchInput — a debounced search box.
 *
 * It keeps its own text value and calls onDebouncedChange a short moment after
 * the user stops typing, so we don't fire an API request on every keystroke.
 */
'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  initialValue?: string;
  placeholder?: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

export function SearchInput({
  initialValue = '',
  placeholder,
  onDebouncedChange,
  delay = 350,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const id = setTimeout(() => onDebouncedChange(value.trim()), delay);
    return () => clearTimeout(id);
    // onDebouncedChange is stable enough in our usage; we intentionally depend
    // only on the typed value and delay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return (
    <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3.5">
      <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
      />
    </div>
  );
}
