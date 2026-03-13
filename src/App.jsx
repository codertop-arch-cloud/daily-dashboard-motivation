import { useState, useEffect } from "react";

export default function App() {

  const [quote, setQuote] = useState({ text: "", author: "" });
  const [loading, setLoading] = useState(true);

  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {
    try {
      setLoading(true);

      const randomId = Math.floor(Math.random() * 100) + 1;
      const response = await fetch(`https://dummyjson.com/quotes/${randomId}`);
      const data = await response.json();

      setQuote({
        text: data.quote,
        author: data.author || "Unknown",
      });

    } catch (error) {
      setQuote({
        text: "Stay positive, work hard, make it happen.",
        author: "Unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const handleLike = () => {
    if (!quote.text) return;

    setLikedQuotes((prev) => {
      const exists = prev.find((q) => q.text === quote.text);

      if (exists) {
        return prev.filter((q) => q.text !== quote.text);
      } else {
        return [...prev, quote];
      }
    });
  };

  const isLiked = likedQuotes.some((q) => q.text === quote.text);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Daily Motivation Dashboard</h1>

      {loading ? (
        <p>Loading quote...</p>
      ) : (
        <div>
          <p>"{quote.text}"</p>
          <p>- {quote.author}</p>
        </div>
      )}

      <button onClick={fetchQuote}>New Quote</button>

      <button onClick={handleLike} style={{ marginLeft: "10px" }}>
        {isLiked ? "Unlike 💔" : "Like ❤️"} ({likedQuotes.length})
      </button>

      <h3>Liked Quotes</h3>

      {likedQuotes.map((q, index) => (
        <div key={index}>
          <p>"{q.text}"</p>
          <small>- {q.author}</small>
        </div>
      ))}
    </div>
  );
}