
function GlobalHeader() {
    return (
        <header className="sticky top-0 z-50 bg-red-500 text-white flex items-center justify-between px-6 py-3 shadow-md">
            {/* Left Section: Logo + App Name */}
            <div className="flex items-center space-x-3">
                <img src="https://cdn.zaggle.in/images/web/zaggle-ems/icons/qr-summary-report.svg" alt="Client Logo" className="h-10 w-auto" />
                <h1 className="text-xl font-semibold">Zaggle</h1>
            </div>

            {/* Middle Section: Navigation */}
            <nav>
                <ul className="flex space-x-6 text-white font-medium">
                    <li><a href="/" className="hover:text-gray-300">Paisa</a></li>
                    <li><a href="/about" className="hover:text-gray-300">More Paisa</a></li>
                    <li><a href="/contact" className="hover:text-gray-300">Andha Paisa!!</a></li>
                </ul>
            </nav>

            {/* Right Section: Logout */}
            <div>
                <button className="border border-white rounded px-4 py-1 hover:bg-white hover:text-red-800 transition">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default GlobalHeader;