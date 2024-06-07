import { useState } from "preact/hooks";
import { FunctionComponent } from "preact";

type Props = {
  isFav: boolean;
  videoId: string;
  userId: string;
};

const FavButton: FunctionComponent<Props> = ({ isFav, videoId, userId }) => {
  const [fav, setFav] = useState<boolean>(isFav);

  const handleClick = async () => {
    // const response = await fetch(
    //   `${Deno.env.get("API_URL")}/fav/${userId}/${videoId}`,
    //   { method: "POST" },
    // );

    // if (!response.ok) {
    //   console.error("Error: Cannot set video as favorite")
    //   return;
    // }

    setFav(!fav);
  };

  return (
    <button class="fav-button" onClick={handleClick}>
      {fav ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
    </button>
  );
};

export default FavButton;
