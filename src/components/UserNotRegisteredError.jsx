export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Access restricted</h1>
        <p className="text-slate-500">
          You are not registered to use this application. Please contact the app
          administrator to request access.
        </p>
      </div>
    </div>
  );
}