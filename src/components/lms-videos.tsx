"use client";

import { useEffect, useState } from "react";

type VideoObject = {
  key: string;
  url: string;
};

const VideoGallery = () => {
  const [videos, setVideos] = useState<VideoObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();
        setVideos(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div>
      {videos.length > 0 ? (
        <div className="video-container">
          {videos.map((video) => (
            <div key={video.key} className="video-item">
              <video controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} width="300" src={video.url} />
              <p>{video.key}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos found</p>
      )}
    </div>
  );
};

export default VideoGallery;
