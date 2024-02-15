import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function BedtimeStory() {
    const location = useLocation();
    const data = location.state?.data; // Retrieve passed data

    // Example of constructing a story from the data
    const story = ''; //`${data.story}`;

    // Set the title of the page
    useEffect(() => {
        document.title = 'Dreamify | Your Bedtime Story';
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Success! Here's Your Bedtime Story</h2>
            <p>{story}</p>
            {/* Display images that correspond to parts of the story */}
            <div>
                <img src="path_to_image" alt="Something" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
            </div>
        </div>
    );
}
