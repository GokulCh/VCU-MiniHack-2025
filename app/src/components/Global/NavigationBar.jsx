import React from 'react';
import 'boxicons/css/boxicons.min.css';
import { HashLink } from 'react-router-hash-link';

const navItems = [
  { name: 'Home', icon: 'bx bx-home-alt-2', href: '/#Home' },
  { name: 'Features', icon: 'bx bx-bell', href: '/#Features' },
  { name: 'How It Works', icon: 'bx bx-info-circle', href: '/#HowItWorks' },
  { name: 'Queries', icon: 'bx bx-package', href: '/Queries/#Home' },
  { name: 'Traffic Map', icon: 'bx bx-map', href: '/TrafficMap/#Home' },
  { name: 'Future Works', icon: 'bx bx-rocket', href: '/#Future' },
  { name: 'Motivation', icon: 'bx bx-heart', href: '/#Motivation' },
  { name: 'Manager', icon: 'bx bx-cog', href: '/Manager/#Home' },
  { name: 'GitHub', icon: 'bx bxl-github', href: 'https://github.com/cmsc-vcu/cmsc408-fa2024-proj-blue' },
];

const NavigationBar = () => {
  return (
    <header id="NavigationBar" className="fixed w-full top-7 flex justify-center backdrop-blur-xl z-50">
      <section
        id="NavigationBarContainer"
        className="flex w-full max-w-6xl rounded-xl bg-black/30 border border-1 border-gray-800 px-3 py-2 items-center shadow-[0_0_15px_5px_rgba(0,0,0,0.2)]"
      >
        <div id="NavigationBarContainerLeft" className="flex items-center space-x-2">
          <i className="bx bx-grid text-2xl"></i>
          <p className="text-blue-500 font-semibold">SmartCity</p>
        </div>

        <div id="NavigationBarContainerRight" className="flex items-center justify-end space-x-4 w-full">
          <nav className="flex space-x-4">
            {navItems.map((item, index) => (
              <HashLink
                key={index}
                to={item.href}
                className="flex items-center rounded-md px-2 py-2 space-x-1 text-white hover:bg-gray-700 font-sans text-[14px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
                smooth
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </HashLink>
            ))}
          </nav>
        </div>
      </section>
    </header>
  );
};

export default NavigationBar;
