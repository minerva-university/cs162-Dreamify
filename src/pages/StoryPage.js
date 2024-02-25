import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function BedtimeStory() {
    const location = useLocation();
    const receivedData = location.state?.data; // Retrieve passed data
    
    // Combine chapters and images
    const data = receivedData['chapters'].map((chapter, index) => ({
        chapter,
        image: "data:image/png;base64," + receivedData['images'][index],
    }));
    // Set the title of the page
    useEffect(() => {
        document.title = 'Dreamify | Your Bedtime Story';
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Success! Here's Your Bedtime Story</h2>
            {data.map((item, index) => (
            <div key={index}>
            <img src={item.image} alt={`Chapter ${index + 1}`} style={{ width: '50%', height: 'auto', alignItems: 'center'}} />
            <br />
            <b>{item.chapter.substring(0, 9)}</b>
            <br />
            <p>{item.chapter.substring(10)}</p>
            
            </div>
      ))}
        </div>
    );
}
