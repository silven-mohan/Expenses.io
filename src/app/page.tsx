export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ExpenseLedger</h1>
        <p className="text-lg text-muted mb-8">
          Redirecting to dashboard...
        </p>
      </div>
      <script>{`window.location.href = '/dashboard'`}</script>
    </div>
  );
}
