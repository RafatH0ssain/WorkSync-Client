const ErrorPage = () => {
    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
            <h1 className="text-6xl font-extrabold">Oops!</h1>
            <p className="text-2xl mt-4">Something went wrong.</p>
            <p className="text-xl mt-2">We couldn't find the page you're looking for.</p>
            <div className="mt-8">
                <button
                    className="btn bg-white text-black py-2 px-6 rounded-lg font-bold hover:bg-blue-800 transition"
                    onClick={() => window.location.href = '/'}>Go Back Home</button>
            </div>
            <img
                src="https://i.ibb.co/0Jdbzmw/error.png"
                alt="404 image"
                className="w-96 h-96"
            />
        </div>
    );
}

export default ErrorPage;