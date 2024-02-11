export default function Stories() {
    const posts = [
      {
        id: 1,
        title: 'Great story!',
        text: 'Beautiful day in Portland! The sun is shining. I am looking forward to the weekend.',
        timestamp: 'a minute ago',
      },
      {
        id: 2,
        title: 'A beatiful story!',
        text: 'It is a beautiful day! I am looking forward to the weekend. I am going to go to the beach and have a picnic with my friends. I am going to play volleyball and swim in the ocean. I am going to have a great time!',
        timestamp: 'an hour ago',
      },
    ];
  
    return (
      <>
        {posts.length === 0 ?
          <p>There are no blog posts.</p>
        :
          posts.map(post => {
            return (
              <p key={post.id}>
                <b>{post.title}</b>
                <br />
                {post.text}
              </p>
            );
          })
        }
      </>
    );
  }