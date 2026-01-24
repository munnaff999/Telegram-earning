* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background: #f2f2f2;
}

.app {
  max-width: 420px;
  margin: auto;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 15px;
  background: #4CAF50;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pages {
  flex: 1;
  padding: 20px;
}

.page {
  display: none;
}

.page.active {
  display: block;
}

.main-btn {
  margin-top: 20px;
  width: 100%;
  padding: 15px;
  background: #4CAF50;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 10px;
}

.card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
}

.card button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border: none;
  background: #2196F3;
  color: #fff;
  border-radius: 8px;
}

.nav {
  display: flex;
  border-top: 1px solid #ddd;
}

.nav button {
  flex: 1;
  padding: 10px;
  background: #fff;
  border: none;
  font-size: 14px;
}
