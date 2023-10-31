import React, { useState, FormEvent } from 'react';

interface Coordinates {
    latitude: string;
    longitude: string;
}

interface Suburb {
    id: number;
    suburbName: string;
    latitude: number;
    longitude: number;
}

interface ServerResponse {
    point: Coordinates;
    suburb: Suburb;
    distance: number;
}
const baseUrl = "http://localhost:5015/";
const calculateNearestSuburbUrl = "suburb/CalculateNearestSuburb";

const SuburbDistance: React.FC = () => {
    const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: '', longitude: '' });
    const [serverResponse, setServerResponse] = useState<ServerResponse | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCoordinates({
            ...coordinates,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const url = baseUrl+calculateNearestSuburbUrl;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordinates),
            });

            if (response.ok) {
                const data: ServerResponse = await response.json();
                setServerResponse(data);
            } else {
                console.log('Failed to submit coordinates');
            }
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    };

    const handleReset = () => {
        setCoordinates({
            latitude: '',
            longitude: '',
        });
        setServerResponse(null);
    };

    return (
        <div className="SuburbDistance">
            <h1>Enter Coordinates</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="latitude">Latitude: </label>
                    <input
                        id="latitude"
                        name="latitude"
                        type="text"
                        value={coordinates.latitude}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="longitude">Longitude: </label>
                    <input
                        id="longitude"
                        name="longitude"
                        type="text"
                        value={coordinates.longitude}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleReset}>
                    Reset
                </button>
            </form>
            {serverResponse && (
                <div>
                    <h2>Received Data:</h2>
                    <p><strong>SuburbName-Id:</strong> {`${serverResponse.suburb.suburbName}-${serverResponse.suburb.id}`}</p>
                    <p><strong>(Latitude, Longitude): </strong>
                        ({serverResponse.point.latitude},{serverResponse.point.longitude})
                    </p>
                    <p><strong>Distance:</strong> {serverResponse.distance}</p>
                </div>
            )}
        </div>
    );
};

export default SuburbDistance;
