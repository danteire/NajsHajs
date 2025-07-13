import React from 'react';
import { useLocation, Link } from 'react-router-dom';

// WAŻNE: Usunięto importy obrazów.
// Obrazy będą teraz ładowane bezpośrednio z katalogu 'public'.
// Upewnij się, że masz następującą strukturę katalogów w folderze 'public':
// public/resources/pln/50.jpg
// public/resources/pln/100.jpg
// ... itd.
// public/resources/try/5.jpg
// public/resources/try/10.jpg
// ... itd.
// public/resources/usd/100.jpg
// public/resources/nieznany_banknot.jpg (ogólny fallback)
// public/resources/pln/nieznany.jpg (dla PLN)
// public/resources/try/nieznany.jpg (dla TRY)


function ResultsPage() {
    const location = useLocation();
    // Receive data from the router, including the base64 of the original (scaled) image
    const serverResponses = location.state?.serverResponses;
    const originalImageBase64 = location.state?.originalImageBase64; // New variable

    /**
     * Helper function to get the banknote image URL based on predicted_class.
     * Images are now loaded from paths relative to the public/ directory.
     * @param {string} predictedClass - The predicted class name from the server (e.g., "PLN_100", "TRY_50").
     * @returns {string} - The URL path to the banknote image in the public/ directory.
     */
    const getBanknoteImageUrl = (predictedClass) => {
        // Split predictedClass into currency and value
        const parts = predictedClass.split('_');
        if (parts.length !== 2) {
            // If the format is invalid, return a general unknown banknote image and log an error
            console.error(`Invalid predicted_class format: ${predictedClass}. Returning general unknown banknote image.`);
            return "/resources/nieznany_banknot.jpg"; // Path in public/
        }

        const currency = parts[0].toUpperCase(); // E.g., "PLN", "TRY", "USD"
        const value = parseInt(parts[1], 10);     // E.g., 50, 100

        // Check if value is NaN (not a valid number)
        if (isNaN(value)) {
            console.error(`Invalid value in predicted_class: ${predictedClass}. Returning general unknown banknote image.`);
            return "/resources/nieznany_banknot.jpg";
        }

        switch (currency) {
            case "PLN":
                switch (value) {
                    case 10:
                        return "/resources/pln/10.jpg";
                    case 20:
                        return "/resources/pln/20.jpg";
                    case 50:
                        return "/resources/pln/50.jpg";
                    case 100:
                        return "/resources/pln/100.jpg";
                    case 200:
                        return "/resources/pln/200.jpg";
                    case 500:
                        return "/resources/pln/500.jpg";
                    default:
                        console.warn(`No specific image for PLN value: ${value}. Returning PLN unknown banknote image.`);
                        return "/resources/nieznany_banknot.png"; // Path in public/
                }
            case "TRY":
                switch (value) {
                    case 5:
                        return "/resources/try/5.jpg";
                    case 10:
                        return "/resources/try/10.jpg";
                    case 20:
                        return "/resources/try/20.jpg";
                    case 50:
                        return "/resources/try/50.jpg";
                    case 100:
                        return "/resources/try/100.jpg";
                    case 200:
                        return "/resources/try/200.jpg";
                    default:
                        console.warn(`No specific image for TRY value: ${value}. Returning TRY unknown banknote image.`);
                        return "/resources/nieznany_banknot.png"; // Path in public/
                }
            case "USD": // Add handling for other currencies if needed
                switch (value) {
                    case 1:
                        return "/resources/usd/1.jpg";
                    case 2:
                        return "/resources/usd/2.jpg";
                    case 5:
                        return "/resources/usd/5.jpg";
                    case 10:
                        return "/resources/usd/10.jpg";
                    case 20:
                        return "/resources/usd/20.jpg";
                    case 50:
                        return "/resources/usd/50.jpg";
                    case 100:
                        return "/resources/usd/100.jpg";
                    default:
                        console.warn(`No specific image for USD value: ${value}. Returning general unknown banknote image.`);
                        return "/resources/nieznany_banknot.png"; // No specific image for this USD denomination
                }
            case "EUR":
                switch (value) {
                    case 5:
                        return "/resources/eur/5.jpg";
                    case 10:
                        return "/resources/eur/10.jpg";
                    case 20:
                        return "/resources/eur/20.jpg";
                    case 50:
                        return "/resources/eur/50.jpg";
                    case 100:
                        return "/resources/eur/100.jpg";
                    case 200:
                        return "/resources/eur/200.jpg";
                    case 500:
                        return "/resources/eur/500.jpg";
                    default:
                        console.warn(`No specific image for EUR value: ${value}. Returning EUR unknown banknote image.`);
                        return "/resources/nieznany_banknot.png"; // Path in public/
                }
            default:
                console.warn(`Currency "${currency}" not recognized. Returning general unknown banknote image.`);
                return "/resources/nieznany_banknot.png"; // General image if currency is not recognized
        }
    };

    if (!serverResponses) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">No results</h2>
                    <p className="text-gray-700 mb-6">Go back to the home page and try uploading an image again.</p>
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white font-bold py-2 px-4 rounded-lg
                       transition duration-300 ease-in-out"
                    >
                        Go back to upload
                    </Link>
                </div>
            </div>
        );
    }

    // Get data from the server response
    const error = serverResponses?.error;

    const classifiers = ["knn", "rf", "svm"];

    const formatProbability = (prob) => (prob * 100).toFixed(2) + '%';

    // Check if the server returned a "not_recognized" error
    if (error === "not_recognized") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Server Results</h1>
                    <div className="text-red-600 mb-6 text-lg font-medium">
                        <p>Could not recognize the banknote.</p>
                        <p className="font-bold">Try again with a different image.</p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white font-bold py-2 px-4 rounded-lg
                       transition duration-300 ease-in-out"
                    >
                        Upload another image
                    </Link>
                </div>
            </div>
        );
    }

    // const banknoteImageUrl = getBanknoteImageUrl(predicted_class);

    // Function to format probability as a percentage
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Recognition Results</h1>

                {originalImageBase64 && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">Uploaded Image:</h2>
                        <img
                            src={`data:image/jpeg;base64,${originalImageBase64}`}
                            alt="Uploaded Image"
                            className="mx-auto rounded-lg shadow-md max-w-full h-auto"
                            style={{maxWidth: '500px', maxHeight: '500px'}}
                        />
                        <p className="text-sm text-gray-500 mt-2">Image size: 500x500px (before sending)</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classifiers.map((clfKey) => {
                        const clfData = serverResponses[clfKey];
                        if (!clfData) return null;

                        const predictedClass = clfData.pred;
                        const banknoteImageUrl = getBanknoteImageUrl(predictedClass);
                        const probabilities = clfData.proba;

                        return (
                            <div key={clfKey} className="bg-gray-50 border rounded-lg p-4 shadow-md">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 uppercase">{clfKey}</h2>

                                <img
                                    src={banknoteImageUrl}
                                    alt={`${predictedClass.replace('_', ' ')} Banknote`}
                                    className="mx-auto rounded-lg shadow-sm mb-4 max-w-full h-auto"
                                    style={{maxWidth: '200px', maxHeight: '200px'}}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/200x100?text=Brak+obrazu";
                                    }}
                                />

                                <p className="text-gray-700 text-md mb-2">
                                    Predicted: <span className="font-semibold">{predictedClass.replace('_', ' ')}</span>
                                </p>

                                {probabilities && (
                                    <ul className="text-sm text-left">
                                        {Object.entries(probabilities)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([label, prob]) => (
                                                <li key={label}
                                                    className="flex justify-between border-b border-gray-200 py-1">
                                                    <span>{label.replace('_', ' ')}</span>
                                                    <span
                                                        className="font-bold text-blue-600">{formatProbability(prob)}</span>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Link
                    to="/"
                    className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                     text-white font-bold py-2 px-4 rounded-lg
                     transition duration-300 ease-in-out"
                >
                    Upload another image
                </Link>
            </div>
        </div>
    );
}
export default ResultsPage;
