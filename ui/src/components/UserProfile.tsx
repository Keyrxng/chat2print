export default function UserProfile({ user }) {
  console.log("user", user);
  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>
          <strong>Name:</strong> {user?.user?.email}
        </p>
        <p>
          <strong>Email:</strong> {user?.user?.email}
        </p>
      </div>
    </div>
  );
}
