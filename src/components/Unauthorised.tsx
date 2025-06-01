export default function Unauthorized() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }
  