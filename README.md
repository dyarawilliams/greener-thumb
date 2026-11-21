<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dyarawilliams/greener-thumb">
    🌱
  </a>

<h3 align="center">Greener Thumb</h3>

  <p align="center">
    A React + Vite houseplant finder that recommends indoor plants from the Perenual API by light, water, and pet or kid safety.
    <br />
    <a href="https://github.com/dyarawilliams/greener-thumb#readme"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dyarawilliams/greener-thumb/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/dyarawilliams/greener-thumb/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#scripts">Scripts</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

<!-- TODO: Add a product screenshot to the repo and embed it here. No screenshot is checked in. The only images in the tree are public/img/splash_plant1.jpg, public/img/placeholder_plant.jpg, public/vite.svg, and src/assets/react.svg. -->

Greener Thumb is a single-page app for picking indoor plants. The form in [`src/FormSection.jsx`](src/FormSection.jsx) asks about edible plants, pets or kids, lifespan, watering, and sunlight. Submitting it calls the Perenual v2 species list with `indoor=1` and your selections, then [`src/PlantList.jsx`](src/PlantList.jsx) shows up to four matches.

The npm package name is `greener-thumb-client` (`"private": true` in [`package.json`](package.json)). The page title in [`index.html`](index.html) is Greener Thumb, and the on-page headline is "Murder fewer houseplants…maybe".

The landing hero uses the splash photo at [`public/img/splash_plant1.jpg`](public/img/splash_plant1.jpg). The form sits under the hero, and matches render as cards below the form. Before a search, that section says results will appear there. While a request is in flight, the results area shows a searching state. This README is the project documentation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![Vite][Vite]][Vite-url]
* [![JavaScript][JavaScript]][JavaScript-url]
* [![ESLint][ESLint]][ESLint-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Clone the repo, add a Perenual API key, and start the Vite dev server.

### Prerequisites

* Node.js 18.x, or Node.js 20 or newer. Vite 5.2.11 (the version locked in this repo) declares `"node": "^18.0.0 || >=20.0.0"`.
* npm, which ships with Node.js.

```sh
node -v
npm -v
```

### Installation

1. Create a free API key at [https://perenual.com/docs/api](https://perenual.com/docs/api).
2. Clone the repo
   ```sh
   git clone https://github.com/dyarawilliams/greener-thumb.git
   cd greener-thumb
   ```
3. Install npm packages
   ```sh
   npm install
   ```
4. Create a `.env` file in the project root. `.env` is already listed in [`.gitignore`](.gitignore). Vite loads it automatically and exposes only `VITE_`-prefixed variables to the client as `import.meta.env`. The app reads the key in [`src/FormSection.jsx`](src/FormSection.jsx) as `import.meta.env.VITE_PERENUAL_API_KEY`.

   ```env
   VITE_PERENUAL_API_KEY=your_perenual_api_key
   ```

   The fetch runs in the browser, so this key is included in the client bundle. Vite reads `VITE_` variables itself; the app does not use the `dotenv` package.
5. Start the dev server
   ```sh
   npm run dev
   ```
   Vite prints a local URL. The default is `http://localhost:5173`. Restart the dev server after you change `.env`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Open the app, leave any question on **No preference** to omit it, and submit. [`src/App.jsx`](src/App.jsx) passes the results into the plant list.

The request URL is built in [`src/speciesList.js`](src/speciesList.js) and fetched from [`src/FormSection.jsx`](src/FormSection.jsx):

```text
https://perenual.com/api/v2/species-list?key=<VITE_PERENUAL_API_KEY>&indoor=1&<selected fields>
```

`indoor` is always `1`. Empty fields are dropped before the query string is built. [`src/speciesList.js`](src/speciesList.js) maps the form controls onto the parameter names and allowed values in the current [Perenual species-list docs](https://perenual.com/docs/api). Values outside that set are not sent.

The questions are radio groups. **No preference** sends nothing for that field.

| Form label | Option shown | Query parameter | Value sent |
| --- | --- | --- | --- |
| Do you want a plant you can eat? | Yes | `edible` | `1` |
| Do you want a plant you can eat? | No | `edible` | `0` |
| Will pets or kids share the room? | Yes — safe to have around | `poisonous` | `0` |
| Will pets or kids share the room? | No | `poisonous` | `1` |
| How long should it live? | Preferably forever - perennial | `cycle` | `perennial` |
| How long should it live? | I'm here for a fun time, not a long time - annual | `cycle` | `annual` |
| How often can you water? | Yes - I have a regular schedule | `watering` | `frequent` |
| How often can you water? | Yes - every so often | `watering` | `average` |
| How often can you water? | Maybe - if I remember, but don't count on it... | `watering` | `minimum` |
| How much light does the spot get? | Full sun! | `sunlight` | `full_sun` |
| How much light does the spot get? | All shade, all the time | `sunlight` | `full_shade` |
| How much light does the spot get? | Equal parts sun and shade (or I dunno...) | `sunlight` | `part_shade` |

The docs also allow `cycle` values `biennial` and `biannual`, a `watering` value of `none`, and a `sunlight` value of `sun-part_shade`. The form does not offer those choices. `poisonous`, `edible`, and `indoor` are `0` or `1`.

The documented list body is `{ data: [...], to, per_page, current_page, from, last_page, total }`. Each list item includes `common_name`, `scientific_name`, and `default_image`. `cycle`, `watering`, and `sunlight` are documented on the species details endpoint, not on this list example. The app reads `data`. If one of those care fields is present and contains the string `Upgrade` (the free-plan placeholder), that plant is removed. The remaining plants are shuffled, and the list keeps the first four. A payload without a `data` array is treated as a failed request.

Each card shows:

* Common name as the heading. Scientific names, when `scientific_name` is an array or string, appear under it in italics (arrays are joined with commas). If the common name is missing, the scientific name is the heading.
* `default_image.small_url` when Perenual sends one, otherwise `/img/placeholder_plant.jpg`
* Lifecycle (`cycle`), watering, and sunlight only when that list item includes them

If the filtered list is empty, the message is `No results returned, please modify your selection and try again.` If the request throws, or the body is not a species list, the message is `Internal Server Error`.

Before any search, the right-hand pane uses `/img/splash_plant1.jpg`. Vite serves [`public/img/splash_plant1.jpg`](public/img/splash_plant1.jpg) and [`public/img/placeholder_plant.jpg`](public/img/placeholder_plant.jpg) from the site root.

### Scripts

From [`package.json`](package.json):

| Script | Command | What it runs |
| --- | --- | --- |
| `dev` | `npm run dev` | `vite` |
| `build` | `npm run build` | `vite build` (output in `dist/`) |
| `preview` | `npm run preview` | `vite preview` (serves the production build) |
| `lint` | `npm run lint` | `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0` |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Call `https://perenual.com/api/v2/species-list`, the species-list route in the current Perenual docs.
- [x] Send `poisonous` for pets or kids, `cycle` for lifespan, and `watering` for the water schedule. `edible`, `sunlight`, and `indoor=1` already matched the species-list docs.
- [x] Load the splash and placeholder images from `/img/splash_plant1.jpg` and `/img/placeholder_plant.jpg`.
- [ ] Report a missing `VITE_PERENUAL_API_KEY`, a non-OK response, and Perenual error payloads (invalid key, rate limit) in place of the generic `Internal Server Error` string.
- [ ] Page through `species-list` results. The app requests the default page and then shuffles and keeps four plants.
- [ ] Open a detail view for a chosen plant from the species details endpoint.
- [x] Remove the unused `dotenv` dependency. Vite already loads `.env`.
- [ ] Add tests for the filter form and the four-plant result list.

See the [open issues](https://github.com/dyarawilliams/greener-thumb/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/dyarawilliams/greener-thumb/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dyarawilliams/greener-thumb" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->
## License

No license specified yet. This repository does not include a license file.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

D'yara Williams — [@xchaoticrage](https://x.com/xchaoticrage) — [LinkedIn](https://linkedin.com/in/dyarawilliams) — [dyarawilliams.com](https://dyarawilliams.com) — [GitHub](https://github.com/dyarawilliams)

Project Link: [https://github.com/dyarawilliams/greener-thumb](https://github.com/dyarawilliams/greener-thumb)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Perenual API](https://perenual.com/docs/api) — species data for the plant list
* [Vite](https://vitejs.dev/) and [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — dev server, production build, and React Fast Refresh
* [React](https://react.dev/)
* [ESLint](https://eslint.org/)
* [Shields.io](https://shields.io/) — badge images
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) by [Othneil Drew](https://github.com/othneildrew)
* Splash and placeholder photos checked in at [`public/img/splash_plant1.jpg`](public/img/splash_plant1.jpg) and [`public/img/placeholder_plant.jpg`](public/img/placeholder_plant.jpg)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/dyarawilliams/greener-thumb.svg?style=for-the-badge
[contributors-url]: https://github.com/dyarawilliams/greener-thumb/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dyarawilliams/greener-thumb.svg?style=for-the-badge
[forks-url]: https://github.com/dyarawilliams/greener-thumb/network/members
[stars-shield]: https://img.shields.io/github/stars/dyarawilliams/greener-thumb.svg?style=for-the-badge
[stars-url]: https://github.com/dyarawilliams/greener-thumb/stargazers
[issues-shield]: https://img.shields.io/github/issues/dyarawilliams/greener-thumb.svg?style=for-the-badge
[issues-url]: https://github.com/dyarawilliams/greener-thumb/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/dyarawilliams
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/docs/Web/JavaScript
[ESLint]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
