async function testProtectedRoute() {
  const token = document.querySelector('#token').value.trim();
  const result = document.querySelector('#result');

  const response = await fetch('/api/protected', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const data = await response.json();
  result.textContent = JSON.stringify({ status: response.status, ...data }, null, 2);
}

document.querySelector('#test-button').addEventListener('click', testProtectedRoute);
