const fs = require('fs');
const file = 'd:/Projects/Featherlite/Featherlite/client/src/components/Navbar/Navbar.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add isAvailabilityPage check
code = code.replace(
  'const location = useLocation();',
  `const location = useLocation();
  const isAvailabilityPage = location.pathname === '/availability';

  const getIconColor = (isActive: boolean) => {
    if (isActive) return 'white';
    return isAvailabilityPage ? '#333333' : 'white';
  };`
);

// 2. Modify navItems to accept color parameter
code = code.replace(/icon: \(\) => \(/g, 'icon: (color: string) => (');

// 3. Replace fill="white" with fill={color} and stroke="white" with stroke={color}
code = code.replace(/fill="white"/g, 'fill={color}');
code = code.replace(/stroke="white"/g, 'stroke={color}');

// 4. Update the render loop to pass the color and use dynamic classes
code = code.replace(
  'const isActive = location.pathname === item.path;',
  `const isActive = location.pathname === item.path;
          const iconColor = getIconColor(isActive);`
);

code = code.replace(
  '{item.icon()}',
  '{item.icon(iconColor)}'
);

// 5. Update Navbar container classes
code = code.replace(
  'className="flex items-center gap-6 p-1 rounded-full backdrop-blur-[6px] bg-[rgba(99,26,21,0.02)] border border-white/10 shadow-2xl"',
  'className={`flex items-center gap-6 p-1 rounded-full backdrop-blur-[6px] border shadow-2xl ${isAvailabilityPage ? "bg-white/30 border-black/10" : "bg-[rgba(99,26,21,0.02)] border-white/10"}`}'
);

// 6. Update Link classes
code = code.replace(
  /className=\{`group flex items-center gap-3 rounded-full transition-all duration-300 pr-8 pl-2 py-1 \$\{\n\s*isActive\n\s*\? "bg-\[#ff0000\] text-white" \n\s*: "bg-\[rgba\(0,0,0,0\.39\)\] text-gray-200 hover:text-white"\n\s*\}`\}/g,
  'className={`group flex items-center gap-3 rounded-full transition-all duration-300 pr-8 pl-2 py-1 ${isActive ? "bg-[#ff0000] text-white" : isAvailabilityPage ? "bg-white/60 text-gray-800 hover:text-black hover:bg-white/80" : "bg-[rgba(0,0,0,0.39)] text-gray-200 hover:text-white"}`}'
);

// 7. Update Icon container classes
code = code.replace(
  /className=\{`flex items-center justify-center rounded-full p-\[6px\] bg-black\/40 transition-colors duration-300 \$\{\n\s*isActive \n\s*\? "border-white bg-black\/40" \n\s*: "border-white\/30 group-hover:border-white\/60"\n\s*\}`\}/g,
  'className={`flex items-center justify-center rounded-full p-[6px] transition-colors duration-300 ${isActive ? "border border-white bg-black/40" : isAvailabilityPage ? "border border-black/20 bg-white/80 group-hover:border-black/50" : "border border-white/30 bg-black/40 group-hover:border-white/60"}`}'
);

fs.writeFileSync(file, code);
console.log("Done");
