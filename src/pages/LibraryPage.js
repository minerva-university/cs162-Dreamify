import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import photo1 from './photos/chapter1.jpg';
import photo2 from './photos/chapter2.jpg';
import photo3 from './photos/chapter3.jpg';
import './styles/LibraryPage.css'; // Ensure you import the CSS file correctly

export default function LibraryPage() {
    // Mapping images to their respective indices for easier access
    const photos = {1: photo1, 2: photo2, 3: photo3};

    // Data structure for characters and their stories
    const characters = {
      Rally: {
        numberOfStories: 2,
        stories: [
          { image: photo1, title: "Rally's First Adventure", dateGenerated: "2022-07-01" },
          { image: photo2, title: "Rally and the Mystery Island", dateGenerated: "2022-08-15" }
        ]
      },
      Ty: {
        numberOfStories: 1,
        stories: [
          { image: photo3, title: "Ty's Journey to the Mountains", dateGenerated: "2022-09-05" }
        ]
      }
    };
  

  return (
    <>
      <Header />
      <div className="library-page">
        {Object.entries(characters).map(([name, data]) => (
          <div key={name}>
            <div className='storyh1h3'>
            <div className='storyh1'><h1>{name}'s Bedtime Stories</h1></div>
            <div className='storyh3'><h3>{data.numberOfStories} items</h3></div>
            </div>
            <div className="hr-style"></div>
            {data.stories.map((story, index) => (
              <div key={index} className="story-block">
                <img src={story.image} alt={`Story ${index + 1}`} className="story-image" />
                <div className="story-details">
                  <div className='story-title-date'>
                   <p className="story-title">{story.title}</p>
                    <p className="story-date">{story.dateGenerated}</p>
                  </div>
                  <div className="story-private">PRIVATE</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}









// import React from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import photo1 from './photos/chapter1.jpg';
// import photo2 from './photos/chapter2.jpg';
// import photo3 from './photos/chapter3.jpg';

// export default function LibraryPage() {
  // // Mapping images to their respective indices for easier access
  // const photos = {1: photo1, 2: photo2, 3: photo3};

  // // Data structure for characters and their stories
  // const characters = {
  //   Rally: {
  //     numberOfStories: 2,
  //     stories: [
  //       { image: photo1, title: "Rally's First Adventure", dateGenerated: "2022-07-01" },
  //       { image: photo2, title: "Rally and the Mystery Island", dateGenerated: "2022-08-15" }
  //     ]
  //   },
  //   Ty: {
  //     numberOfStories: 1,
  //     stories: [
  //       { image: photo3, title: "Ty's Journey to the Mountains", dateGenerated: "2022-09-05" }
  //     ]
  //   }
  // };

//   return (
//     <>
//       <Header />
//       {Object.entries(characters).map(([name, data]) => (
//         <div key={name}>
//           <h1>{name}/Bedtime Stories</h1>
//           <h3>{data.numberOfStories} items</h3>
//           <hr />
//           {data.stories.map((story, index) => (
//             <div key={index}>
//               <img src={story.image} alt={`Story ${index + 1}`} />
//               <p>Title: {story.title}</p>
//               <p>Date of Creation: {story.dateGenerated}</p>
//             </div>
//           ))}
//         </div>
//       ))}
//       <Footer />
//     </>
//   );
// }
