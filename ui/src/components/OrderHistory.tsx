export default function OrderHistory({ orders }) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <div className="border p-4 rounded shadow-md">
        {orders.length === 0 ? (
          <p>No past orders.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="mb-2">
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.total}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
