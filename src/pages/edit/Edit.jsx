import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../../firebase";

function EditRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: "", unit: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, "recipes", recipeId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setImageUrl(data.imageUrl || "");
          setDescription(data.description || "");
          setIngredients(Array.isArray(data.ingredients) ? data.ingredients : [{ ingredient: "", amount: "", unit: "" }]);
          setInstructions(Array.isArray(data.instructions) ? data.instructions : [""]);
        } else {
          console.error("No such recipe found!");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
  
    fetchRecipe();
  }, [recipeId]);
  

  const handleInputChange = (e, index, type) => {
    if (type === "ingredient") {
      const { name, value } = e.target;
      const newIngredients = [...ingredients];
      newIngredients[index][name] = value;
      setIngredients(newIngredients);
    } else if (type === "instruction") {
      const newInstructions = [...instructions];
      newInstructions[index] = e.target.value;
      setInstructions(newInstructions);
    }
  };

  const handleAddIngredient = () => setIngredients([...ingredients, { ingredient: "", amount: "", unit: "" }]);
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleRemoveInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validUrl = imageUrl && /^(ftp|http|https):\/\/[^ "']+$/.test(imageUrl);
      if (!validUrl) {
        alert("Please enter a valid image URL.");
        setLoading(false);
        return;
      }
      const recipeRef = doc(firestore, "recipes", recipeId);
      await updateDoc(recipeRef, {
        title,
        description,
        ingredients,
        instructions,
        imageUrl,
        updatedAt: new Date(),
      });
      setLoading(false);
      navigate(`/profile/${auth.currentUser.uid}`); // Redirect back to user's profile page with their UID
    } catch (error) {
      console.error("Error updating recipe:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
        <form onSubmit={handleUpdateRecipe} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Recipe title" />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="imageUrl">Recipe Image URL</label>
            <input type="text" id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Enter the image URL" />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Write a description of the recipe" />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold">Ingredients</label>
            {ingredients.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input type="text" name="ingredient" value={item.ingredient} onChange={(e) => handleInputChange(e, index, "ingredient")} className="w-1/3 p-2 border rounded-md" placeholder="Ingredient" />
                <input type="text" name="amount" value={item.amount} onChange={(e) => handleInputChange(e, index, "ingredient")} className="w-1/4 p-2 border rounded-md" placeholder="Amount" />
                <input type="text" name="unit" value={item.unit} onChange={(e) => handleInputChange(e, index, "ingredient")} className="w-1/4 p-2 border rounded-md" placeholder="Unit" />
                <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddIngredient} className="text-blue-500 mt-2">Add Ingredient</button>
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold">Instructions</label>
            {instructions.map((step, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="font-bold">{index + 1}.</span>
                <input type="text" value={step} onChange={(e) => handleInputChange(e, index, "instruction")} className="w-full p-2 border rounded-md" placeholder={`Step ${index + 1}`} />
                <button type="button" onClick={() => handleRemoveInstruction(index)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddInstruction} className="text-blue-500 mt-2">Add Step</button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRecipe;
