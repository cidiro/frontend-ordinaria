import { FunctionComponent } from "preact";
import LogoutButton from "../islands/LogoutButton.tsx";

type Props = {
  username: string;
}

const Header: FunctionComponent<Props> = ({ username }) => {
  return (
    <div class="page-container">
      <header class="header-container">
        <div class="header-content">
          <span class="user-name">{username}</span>
          <LogoutButton />
        </div>
      </header>
    </div>
  );
};

export default Header;
