const Home = () => {
    return (
        <div>
            {/* Banner */}
            <div className="min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    {/* Using the placeholder API with a different aspect ratio to simulate a GIF space */}
                    <img
                        src="/api/placeholder/480/270"
                        alt="placeholder for gif"
                        className="max-w-sm rounded-lg shadow-2xl"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">Box Office News!</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
                            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
                            id nisi.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-red-500">
                <h2>Test Content</h2>
                <p>This is just to check if other content is showing up.</p>
            </div>
            {/* Services */}

            {/* Testimonials */}

            {/* Employee of the Month */}

            {/* About Us */}
        </div>
    );
}

export default Home;