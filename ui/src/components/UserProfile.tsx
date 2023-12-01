export default function UserProfile({ user }) {
  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}
