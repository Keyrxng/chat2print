export default function Header() {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat2Print</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="hover:text-secondary transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-secondary transition duration-300"
              >
                Products
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
