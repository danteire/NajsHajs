import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Funkcja obsługująca zmianę pliku w input'cie
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError(null); // Wyczyść poprzednie błędy
    };

    const handleGoToMenu = () => {
    navigate('/menu');
    };


    // Funkcja wysyłająca plik na serwer
    // Funkcja wysyłająca plik na serwer
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Proszę wybrać plik.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Tworzymy FormData i dodajemy plik
            const formData = new FormData();
            formData.append("file", selectedFile); // klucz "file" musi się zgadzać z backendem

            // Wysyłamy żądanie POST z FormData (bez ręcznego ustawiania Content-Type!)
            const response = await fetch('http://127.0.0.1:8000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Wystąpił błąd podczas wysyłania zdjęcia.');
            }

            const data = await response.json();
            console.log('Odpowiedź serwera:', data);

            // Przekierowanie na stronę z wynikami i przekazanie danych
            const base64Image = await toBase64(selectedFile); // tylko do wyświetlenia na results
            navigate('/results', {
                state: {
                    serverResponses: data,
                    originalImageBase64: base64Image
                }
            });

        } catch (err) {
            console.error('Błąd wysyłania:', err);
            setError(err.message || 'Nie udało się wysłać zdjęcia.');
        } finally {
            setUploading(false);
        }
    };

// Pomocnicza funkcja do konwersji pliku na base64 (np. do wyświetlenia w <img> w /results)
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Wgraj swoje zdjęcie</h1>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100 mb-4"
                />
                {selectedFile && (
                    <p className="text-gray-700 mb-4">Wybrany plik: <span
                        className="font-semibold">{selectedFile.name}</span></p>
                )}
                {error && (
                    <p className="text-red-600 mb-4 font-medium">{error}</p>
                )}
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg
                      transition duration-300 ease-in-out
                      ${uploading
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    }`}
                >
                    {uploading ? 'Wysyłanie...' : 'Wyślij'}
                </button>
                <button
                    onClick={handleGoToMenu}
                    className="mt-4 w-full py-3 px-6 rounded-lg text-white font-bold text-lg
      bg-gray-600 hover:bg-gray-700 active:bg-gray-800
      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Menu
                </button>
            </div>
        </div>
    );
}

export default UploadPage;
