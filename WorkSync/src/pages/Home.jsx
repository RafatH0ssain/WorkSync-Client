import customerServiceGif from '../assets/customerServiceHelpGIF.gif';

const Home = () => {
    return (
        <div>
            {/* Banner */}
            <div className="min-h-screen bg-white">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src={customerServiceGif}
                        alt="working online gif"
                        className="max-w-sm rounded-lg"
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

            {/* Services */}

            {/* Testimonials */}

            {/* Employee of the Month */}

            {/* About Us */}
        </div>
    );
}

export default Home;