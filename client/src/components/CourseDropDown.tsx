import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function CoursesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left text-gray-800" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center px-2 py-2 dark:bg-gray-700 font-semibold rounded-md hover:bg-green-100 hover:text-green-600 dark:hover:bg-gray-700 dark:hover:text-green-400 transition"
      >
        Courses
        <svg
          className="ml-1 h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5.25 7.75L10 12.5l4.75-4.75" />
        </svg>
      </button>

      {isOpen && (
        <div
  className="absolute left-0 mt-2 w-56 rounded-md z-50 border border-gray-200 dark:border-gray-700"
  style={{
    backgroundColor: 'rgba(243, 244, 246, 1)', // light gray with transparency
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 0 3px rgba(60, 72, 88, 0.15)',
  }}
>
  <Link
    href="/courseintro/ayurvedic"
    className="block px-4 py-2 font-semibold dark:bg-gray-100  hover:text-green-600 dark:hover:text-green-400 transition"
  >
    The Certificate in Proficiency of Ayurveda
  </Link>
  <Link
    href="/courseintro/beauty"
    className="block px-4 py-2 font-semibold dark:bg-gray-100  hover:text-green-600 dark:hover:text-green-400 transition"
  >
    Elegance of Beauty Through Pure Ayurveda
  </Link>
</div>



      )}
    </div>
  );
}
