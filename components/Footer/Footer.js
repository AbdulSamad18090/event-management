export default function Footer() {
  return (
    <footer className="bg-yellow-500 text-white py-6">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Event Management Platform. All Rights Reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="text-rose-50 hover:text-rose-100">Privacy Policy</a>
          <a href="#" className="text-rose-50 hover:text-rose-100">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
