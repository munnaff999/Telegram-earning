<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Panel</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="topbar">
  <h2>Admin Dashboard</h2>
  <button onclick="logout()">Logout</button>
</header>

<div class="container">

  <!-- STATS -->
  <div class="stats">
    <div class="stat-box">
      <h3 id="totalUsers">0</h3>
      <p>Total Users</p>
    </div>
    <div class="stat-box">
      <h3 id="pendingWithdraws">0</h3>
      <p>Pending Withdrawals</p>
    </div>
  </div>

  <!-- USERS -->
  <div class="card">
    <h3>👤 Users</h3>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Balance</th>
          <th>Total Earned</th>
          <th>Add Balance</th>
        </tr>
      </thead>
      <tbody id="usersTable"></tbody>
    </table>
  </div>

  <!-- WITHDRAWALS -->
  <div class="card">
    <h3>💸 Withdraw Requests</h3>
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="withdrawTable"></tbody>
    </table>
  </div>

</div>

<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

<script src="config.js"></script>
<script src="admin.js"></script>
</body>
</html>
