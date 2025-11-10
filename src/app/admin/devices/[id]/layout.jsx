export default function DeviceDetailLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}