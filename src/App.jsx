import { Helmet } from "react-helmet-async";
import Clarity from '@microsoft/clarity';
import { SantaTracker } from "./components/SantaTracker";
import config from "./config/config";
import useSettings from "./hooks/useSettings";

export default function App() {
  Clarity.init(config.clarity_project_id);

  const { power, speed, state } = useSettings();

  const message = {
    online: "About to jump on the sled",
    driving: "Currently dashing through the snow",
    offline: "Santa is offline...",
    asleep: "Santa is currently resting...",
    suspended: "Santa about to rest...",
    charging: "Santa's loading Xmas presents...",
  };

  return (
    <>
      <Helmet>
        <title>Xmas Tesla Tracker 🎄</title>

        <meta property="og:title" content="Xmas Tesla Tracker 🎄" />
        <meta
          property="og:description"
          content="Follow Santa Claus driving around his Xmas Tesla, all fitted up with lights and horns."
        />
        <meta property="og:image" content="url-to-your-image.jpg" />
        <meta
          property="og:url"
          content="https://playground.anatolinicolae.com/xmas-tesla-tracker/"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Xmas Tesla Tracker 🎄" />
        <meta
          name="twitter:description"
          content="Follow Santa Claus driving around his Xmas Tesla, all fitted up with lights and horns."
        />
        <meta name="twitter:image" content="url-to-your-image.jpg" />
      </Helmet>

      <div className="subpixel-antialiased min-h-svh min-w-full flex flex-col items-center justify-start p-8">
        <h1 className="text-2xl md:text-4xl font-bold mt-4 mb-8 text-center">
          Xmas Tesla Tracker 🎄
        </h1>
        <p className="text-center mb-8">
          Follow Santa Claus driving around his Xmas Tesla, all fitted up with
          lights and horns.
        </p>
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="text-center">{state && message[state]}</span>
          {speed && speed > 0 && (
            <span className="text-center">at {speed} km/h</span>
          )}
          {power && power < 0 && (
            <span className="text-center">Now generating {power}Wh</span>
          )}
        </div>
        <SantaTracker />
      </div>
    </>
  );
}
