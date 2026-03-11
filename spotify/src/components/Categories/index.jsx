import React, { useEffect, useState } from "react";
import LoadingScreen from "../../pages/LoadingScreen";
import Navbar from "../Navbar";
import "./index.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://apis2.ccbp.in/spotify-clone/categories",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const categoriesData = data?.categories?.items || [];
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.id.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredCategories(filtered);
  };

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div>
        <Navbar onSearch={handleSearch} />
        <div className="categories-error">
          <p>Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="categories-grid">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="category-card">
              <img
                src={cat.icons?.[0]?.url || "https://via.placeholder.com/150"}
                alt={cat.name}
                className="category-image"
              />
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.name}</p>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
