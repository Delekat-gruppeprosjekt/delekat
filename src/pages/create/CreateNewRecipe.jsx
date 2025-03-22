import { useState } from "react";
import { useNavigate } from "react-router-dom";  // For navigation after creating a recipe
import { auth } from "../../../firebase";  // Firebase auth
import { getFirestore, collection, addDoc } from "firebase/firestore";  // Firebase Firestore

function CreateNewRecipe() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");  // URL for the image
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // For navigation after successful submission

  // Handle changes in the form fields
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "ingredient") {
      const newIngredients = [...ingredients];
      newIngredients[index] = value;
      setIngredients(newIngredients);
    } else if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "instructions") {
      setInstructions(value);
    }
  };

  // Add a new ingredient field
  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // Remove an ingredient field
  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate the image URL format
      const validUrl = imageUrl && /^(ftp|http|https):\/\/[^ "]+$/.test(imageUrl);
      if (!validUrl) {
        alert("Please enter a valid image URL.");
        setLoading(false);
        return;
      }

      // Fetch the current user's displayName or use 'Anonymous' as fallback
      const author = auth.currentUser.displayName || "Anonymous";

      const recipeData = {
        title,
        description,
        ingredients,
        instructions,
        imageUrl,  // Store the image URL as provided by the user
        author,    // Include the author's name (displayName)
        userId: auth.currentUser.uid,  // User ID for linking the recipe to the user
        createdAt: new Date(),
      };

      // Save recipe data to Firestore
      const db = getFirestore();
      await addDoc(collection(db, "recipes"), recipeData);
      setLoading(false);
      navigate("/");  // Redirect to the recipes page or wherever you want
    } catch (error) {
      console.error("Error adding recipe: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Title */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Recipe title"
            />
          </div>

          {/* Recipe Image URL */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="imageUrl">Recipe Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Enter the image URL"
            />
          </div>

          {/* Recipe Description */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Write a description of the recipe"
            />
          </div>

          {/* Ingredients */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  name="ingredient"
                  value={ingredient}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-3/4 p-2 border rounded-md"
                  placeholder="Ingredient"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="text-blue-500 mt-2"
            >
              Add Ingredient
            </button>
          </div>

          {/* Recipe Instructions */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={instructions}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Write the cooking instructions"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mb-24">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewRecipe;
