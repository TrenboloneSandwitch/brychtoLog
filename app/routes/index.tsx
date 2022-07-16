import { Link } from "@remix-run/react";

const IndexRoute = () => (
  <div>
    Ahoj, tohle je index routa
    <div>
      <Link
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        to="videos"
      >
        Hlavni stranka
      </Link>
    </div>
  </div>
);

export default IndexRoute;
