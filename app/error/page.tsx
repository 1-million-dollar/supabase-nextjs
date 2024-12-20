import Link from "next/link";

export default function ErrorPage() {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg">Page Not Found</p>
        <p className="mt-2 text-sm text-gray-500">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }
  