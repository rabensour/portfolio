import React from 'react';

function Home() {
  return (
    <div className="home">
      <h2>Bienvenue sur Social Media</h2>
      <p>Votre réseau social MERN Stack</p>
      <div className="feed">
        <div className="post-card">
          <h3>Exemple de Post</h3>
          <p>Ceci est un exemple de post dans le feed social media.</p>
          <div className="post-actions">
            <button>❤️ Like</button>
            <button>💬 Comment</button>
            <button>🔗 Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
