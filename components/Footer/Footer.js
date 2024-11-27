export default function Footer() {
  return (
    <footer className="bg-muted/0 text-neutral-600 py-6">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Event Management Platform. All Rights Reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="text-neutral-500 hover:text-neutral-700">Privacy Policy</a>
          <a href="#" className="text-neutral-500 hover:text-neutral-700">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
