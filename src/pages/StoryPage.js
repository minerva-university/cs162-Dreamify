import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import photo1 from './photos/chapter1.jpg'; //detele and extract photos based on storyid from database
import photo2 from './photos/chapter2.jpg'; //same
import photo3 from './photos/chapter3.jpg'; //same
import photo4 from './photos/chapter4.jpg'; //same
import photo5 from './photos/chapter5.jpg'; //same
import './styles/StoryPage.css';


//Things to do:
//1. Delete the photos from the folder and delete import statements above
//2. Extract all the data based on the storyid from the database
//3. Change the way the images are shown on the page
//4. Test (especially how the tabulation works with the text data)
//5. Check that Header and Footer are well integrated



export default function StoryPage() {

  //example data
  const headlines = [
    "The Magical Ticket",
    "The Journey Begins",
    "A Day with Dinosaurs and Knights",
    "The Secret of the Eiffel Tower",
    "The Return Home",
  ];

  const chapters = [
    'Once upon a time, in a cozy little house nestled between rolling hills and whispering trees, there lived a curious little boy named Pablo. Pablo was no ordinary boy; he was the middle child, sandwiched between his older sister, who loved to paint, and his younger brother, who could spend hours building towers with blocks. But Pablo had his own unique interests. He loved to imagine, to dream, and most of all, to learn about far-off places and their histories. One evening, as Pablo was arranging his chess pieces in preparation for a game against himself, he stumbled upon a shimmering, golden ticket hidden beneath the chessboard. It was unlike anything he had ever seen, with words that sparkled in the dim light: "Pablo, embark on a journey to Paris, the city of lights and history." His heart leapt with excitement. This was his chance to see the world beyond!',
    'The very next morning, with the magical ticket tightly clutched in his hand, Pablo found himself standing in front of a magnificent, gleaming train. This was no ordinary train; it was the "Paris Express," ready to whisk him away on his adventure. As the train chugged along, Pablo pressed his nose against the window, watching the world transform before his eyes.Suddenly, the train conductor, a kind gentleman with a twinkling eye, approached Pablo. "I hear you\'re interested in history, young man," he said. Pablo nodded eagerly. "Well, you\'re in for a treat. Paris is full of stories waiting to be discovered by you." Pablo\'s excitement grew as the conductor shared tales of knights, castles, and battles won and lost, all part of Paris\'s rich tapestry of history.',
    "As Pablo stepped off the train in Paris, he was greeted by the sight of a majestic horse, as if plucked from the pages of his favorite storybooks. The horse, named Henri, was to be Pablo's guide through the city. Henri first took Pablo to a grand museum, where skeletons of dinosaurs towered over them. Pablo's eyes widened in awe. He could almost hear the dinosaurs' mighty roars echoing through time. Their next stop was a medieval castle, right in the heart of Paris. As they explored the ancient halls and secret passages, Pablo imagined himself as a brave knight, protecting the castle from dragons. He even found a giant chessboard in the courtyard, where he played a game against Henri, who proved to be a surprisingly skilled opponent.",
    "As the day turned into evening, Henri led Pablo to the most famous landmark of all, the Eiffel Tower. But this was no ordinary visit. Henri whispered a secret to Pablo: \"This tower holds the key to Paris's heart. Climb to the top, and you'll see.\" With a sense of wonder, Pablo ascended the tower, each step taking him higher into the sky.At the top, Pablo gazed out over Paris, the city lights twinkling like stars below. Then, he noticed something incredible. The patterns of the lights seemed to form a giant chessboard, with the Eiffel Tower as its king. It was as if the city itself was inviting Pablo to play a game, to become part of its history.",
    "As the adventure came to an end, Pablo realized it was time to return home. Henri escorted him back to the Paris Express, where the train conductor was waiting with a smile. \"I hope you've found what you were looking for,\" he said. Pablo nodded, his heart full of stories and memories to last a lifetime.When Pablo finally arrived home, his siblings couldn't believe their ears as he recounted his magical journey. They gathered around, listening intently as Pablo spoke of dinosaurs, knights, and the secret of the Eiffel Tower. As he shared his adventure, Pablo realized that the true magic wasn't just in the places he had seen or the history he had learned, but in the joy of sharing his story with others.And so, Pablo's adventure to Paris became a cherished tale in his family, a reminder that with a bit of curiosity and a dash of imagination, every day could be an adventure. The magical ticket had not just taken Pablo to Paris; it had shown him that the world was full of wonders, waiting for him to explore. And who knows? Perhaps one day, another magical ticket would find its way into his hands, leading him to new adventures and stories yet to be told.The end.",
  ];

  const photos = [photo1, photo2, photo3, photo4, photo5];
  //example of extracting photos based on their base64 representation
  //const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  //<img src={imageData} alt="Decoded from Bytes" style={{ width: '50%', height: 'auto' }} /> 

  return (
    <>
      <Header />
      <div className="story-container">
        {headlines.map((headline, index) => (
          <div key={index} className="story-block">
            <h2 className="story-headline">{headline}</h2>
            <p className="story-text">{chapters[index].split('\n').map((line, i) => (<span key={i}>{line}<br/></span>))}</p>
            <img src={photos[index]} className="story-photo" />
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}




// <<<<<<< Mykhailo
// import React from 'react';

// //Misha
// export default function StoryPage() {
//   return (
//     <h1>StoryPage!</h1>
//   );
// =======
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// export default function BedtimeStory() {
//     const location = useLocation();
//     const receivedData = location.state?.data; // Retrieve passed data
    
//     // Combine chapters and images
//     const data = receivedData['chapters'].map((chapter, index) => ({
//         chapter,
//         image: "data:image/png;base64," + receivedData['images'][index],
//     }));
//     // Set the title of the page
//     useEffect(() => {
//         document.title = 'Dreamify | Your Bedtime Story';
//     }, []);

//     return (
//         <div style={{ padding: '20px' }}>
//             <h2>Success! Here's Your Bedtime Story</h2>
//             {data.map((item, index) => (
//             <div key={index}>
//             <img src={item.image} alt={`Chapter ${index + 1}`} style={{ width: '50%', height: 'auto', alignItems: 'center'}} />
//             <br />
//             <b>{item.chapter.substring(0, 9)}</b>
//             <br />
//             <p>{item.chapter.substring(10)}</p>
            
//             </div>
//       ))}
//         </div>
//     );
// >>>>>>> dev
// }
