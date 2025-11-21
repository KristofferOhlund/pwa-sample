# One client - two applications (Progressive Web App)

The purpose of this document is to demonstrate a simple approach for transforming an ordinary web application into a Progressive Web App (PWA), and how the content of the application can be separated depending on whether the user is accessing it through a browser or via the installed app.

This report does not aim to describe the inner workings of PWAs, best practices, caching strategies, offline behavior, or any technical implementation details.

Instead, the focus is  on illustrating how a single client can provide two different user experiences:

- a regular website experience
- app-like experience

This sample will create a **minimal** PWA using the popular frontend library [React](https://react.dev/)

Accessed via the browser:

![web](public/web.png)

Accessed via the installed App:

![app](public/app.png)


## What Is a PWA?

A PWA (Progressive Web App) is essentially a regular website that can also function like a mobile application.

It can be installed on a mobile device, launched in its own window, and offer an app-like interface and experience.
For an overview of PWA fundamentals, general requirements, and recommended practices, refer to:

MDN – Progressive Web Apps Guide

https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps



## PWA requirement

The only requirement to make your website installable as a app, is a manifest.json file.
This file acts like a configuration file for how the application should look and what routes / functionality should be included. 

You then add a link in your index.html file as below:

`<link rel="manifest" href="manifest.json">`

....and thats it! If you're on chrome, you now have an installable webb-app!

**sample manifest.json**
```json
{
"short_name": "pwa",
"name": "pwa-sample",
"icons": [
	{
	"src": "/wapp.png",
	"sizes": "200x200",
	"type": "image/png"
	}
],
"start_url": "/",
"display": "standalone",
"theme_color": "black",
"background_color": "white"
}
```

The following manifest members are required to specify:
- name or shortname
- icons
- start url
- display and /or display_override

### Browser support

Support for PWA installation promotion from the web varies by browser and by platform.

On desktop:

- Chromium browsers support installing PWAs that have a manifest file on all supported desktop operating systems.
- Safari supports Add to Dock (_File_ > _Add to Dock..._) on macOS Sonoma (Safari 17) and later for any web app with or without a manifest file.
- Firefox does not support installing PWAs using a manifest file.

On mobile:

- On Android, Firefox, Chrome, Edge, Opera, and Samsung Internet Browser all support installing PWAs.
- On iOS 16.3 and earlier, PWAs can only be installed with Safari.
- On iOS 16.4 and later, PWAs can be installed from the Share menu in Safari, Chrome, Edge, Firefox, and Orion.

source: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#browser_support

## Implement the PWA

A central idea in this sample is to demonstrate how one and the same client can present different views depending on how it is being accessed. A modern web application can identify whether it is running inside a standard browser tab or as an installed Progressive Web App. Based on this information, it can adapt its interface and selectively expose functionality that is relevant only in one of the contexts.

This sample will create the PWA using the popular frontend library [React](https://react.dev/)

**Requirements for you to be able to follow along**
- You need node.js installed, if not installed head to node and follow the instructions. [Install Node Instructions](https://nodejs.org/en)
- Chrome browser
- Internet connection (obviously)

1. Clone the repo 

```
git clone https://github.com/KristofferOhlund/pwa-sample
```

2. cd into pwa-sample

```
cd pwa-sample
```

3. Install dependencies

```
npm install
```

4. Start dev server

```
npm run dev
```

Now open the chrome browser and go to `localhost:5173`- you should now get a message saying it runs as a default website.

![Web](public/web.png)

In the URL window - you should see this icon (computer):

![Install](public/install.png)

This tells you that you can install the website as an application, click install.

![Confirm](public/confirm.png)

You should now have it installed and act as an app, notice that the URL part of the screen has also disappeared.

![app](public/app.png)

You can also see that the app is installed as an app

![app.app](public/app.app.png)

It can also be docked (MacOS)

![dock](public/dock.png)

To uninstall the App, simply open the app and press the 3 dots in the right corner, then press "uninstall"

![uninstall](public/uninstall.png)


## Wrap-up

Ok - so we just saw an example of 1 client showing two different messages (components). How is this done?
In this example we used React framework to create the logic for render the correct component.

```js
/**
 * This is the main method for the application
 * When the component is rendered 'useEffect' is called
 * it then checks the current-display mode and updates on change.
 * 
 * The result is, if display-mode is standalone (app) we render
 * the pwa component, else we render the web component
 */
function App() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    // set initialValue
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    setIsPwa(mediaQuery.matches);

    // Update value on change
    const listener = (event) => {
      setIsPwa(event.matches);
    }

    // Add event
    mediaQuery.addEventListener("change", listener);

    // clean-up to avoid multiple eventListeners
    return () => {
      mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Render component based on display-mode
  const RenderComponent = isPwa ? Pwa : Web;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RenderComponent className="pwa" />} />
        </Routes>
      </Router>
    </>
  );
}
```

**Summary:**
1. Create manifest.json
    - Add [required](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#required_manifest_members) manifest members
2. Add link to manifest from index.html
3. Create logic to render the right component / content

---
