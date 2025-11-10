const TemplateLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default TemplateLayout;
