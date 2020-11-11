import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-black text-white py-5">
      <div className="container flex flex-row justify-between items-center">
        <div>
          <Link to="/">Sovryn</Link>
        </div>
        <div>
          <a
            href="https://live.sovryn.app"
            className="px-3 py-2 border-2 border-green-600 rounded text-sm text-green-600 font-bold transition duration-300 easy-in-out hover:text-white hover:bg-green-600"
            target="_blank"
            rel="noreferrer"
          >
            App
          </a>
        </div>
      </div>
    </header>
  );
}
