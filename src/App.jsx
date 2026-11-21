import { useState } from 'react';
import './App.css';
import FormSection from './FormSection';
import PlantList from './PlantList';

function LeafMark() {
    return (
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <path
                fill="currentColor"
                d="M16 3.2C10.2 9.2 7.4 14 7.4 18.8A8.6 8.6 0 0 0 16 27.4a8.6 8.6 0 0 0 8.6-8.6C24.6 14 21.8 9.2 16 3.2zm.1 21.2a5.7 5.7 0 0 1-5.7-5.6c0-3.1 1.7-6.6 5.7-10.8 4 4.2 5.7 7.7 5.7 10.8a5.7 5.7 0 0 1-5.7 5.6z"
            />
            <path
                fill="currentColor"
                d="M16.2 11.2c.1 3.6-.6 6.4-2.4 8.8-.3.4.2.9.6.5 2.2-2 3.4-4.8 3.5-8.9.1-.6-.9-.9-1.2-.4h-.5z"
            />
        </svg>
    );
}

function App() {
    const [plants, setPlants] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    return (
        <div className="page">
            <header className="site-header">
                <a className="skip-link" href="#finder">Skip to plant finder</a>
                <div className="shell header-bar">
                    <a className="brand" href="#top">
                        <LeafMark />
                        Greener Thumb
                    </a>
                    <a className="button button-quiet" href="#finder">Find a plant</a>
                </div>
            </header>
            <main id="top">
                <section className="hero shell" aria-labelledby="hero-title">
                    <div className="hero-copy">
                        <p className="eyebrow">
                            <span className="eyebrow-dot" aria-hidden="true" />
                            Indoor plant finder
                        </p>
                        <h1 id="hero-title">
                            Murder fewer houseplants
                            <span className="h1-soft">…maybe</span>
                        </h1>
                        <p className="lede">
                            Tell us about your light, your watering habits, and who shares the room.
                            We will suggest a plant with a better chance of sticking around.
                        </p>
                        <div className="hero-actions">
                            <a className="button button-primary" href="#finder">Find a plant</a>
                        </div>
                        <ul className="hero-points">
                            <li>Indoor plants</li>
                            <li>Light and water</li>
                            <li>Pets and kids</li>
                        </ul>
                    </div>
                    <div className="hero-media">
                        <figure className="hero-photo">
                            <img
                                src={`${import.meta.env.BASE_URL}img/splash_plant1.jpg`}
                                alt="A person with raised arms standing beside a tall bird of paradise plant in a dark planter"
                            />
                        </figure>
                    </div>
                </section>
                <FormSection
                    setPlants={setPlants}
                    setMessage={setMessage}
                    setIsSearching={setIsSearching}
                    isSearching={isSearching}
                />
                <PlantList plants={plants} message={message} isSearching={isSearching} />
            </main>
            <footer className="site-footer">
                <div className="shell">
                    <p>Greener Thumb matches indoor plants from the Perenual species list.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
