function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-0">
          &copy; {currentYear} Full-Stack Application. Built with React, Express, and MongoDB.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
