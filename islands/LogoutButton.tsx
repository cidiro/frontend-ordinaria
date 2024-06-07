const LogoutButton = () => {
  const onLogOut = () => {
    document.cookie = "auth=;  path=/;";
    window.location.href = "/login";
  }

  return (
    <button class="logout-button" onClick={onLogOut}>Logout</button>
  );
};

export default LogoutButton;
