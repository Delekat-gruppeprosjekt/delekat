import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../../firebase";
import { getFirestore, collection, addDoc, getDoc, doc } from "firebase/firestore";

function CreateNewRecipe() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: "", unit: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState("/assets/avatar_placeholder.png");
  const navigate = useNavigate();

  // Fetch the user's avatar URL from Firestore
  useEffect(() => {
    const fetchUserAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);  // Assuming there's a 'users' collection
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Log to verify the structure of the document
            console.log(userData); 
            
            // Safely set avatar URL or use the placeholder if not found
            setAuthorAvatarUrl(userData.avatarUrl || "/assets/avatar_placeholder.png");
          } else {
            // If no document exists, use the placeholder
            console.log("No user data found");
            setAuthorAvatarUrl("/assets/avatar_placeholder.png");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          // Handle error gracefully
        }
      }
    };

    fetchUserAvatar();
  }, []);

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

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", amount: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate the image URL
      const validUrl = imageUrl && /^(ftp|http|https):\/\/[^ "']+$/.test(imageUrl);
      if (!validUrl) {
        alert("Please enter a valid image URL.");
        setLoading(false);
        return;
      }

      // Get the current user's display name, avatar URL, and ID
      const author = auth.currentUser.displayName || "Anonymous";
      const authorId = auth.currentUser.uid;  // Author's unique ID from Firebase Auth

      // Prepare recipe data with the new field authorAvatarUrl and authorId
      const recipeData = {
        title,
        description,
        ingredients,
        instructions,
        imageUrl,
        author,
        authorAvatarUrl,  // Use the dynamic avatar URL here
        userId: authorId,  // This is the same as authorId, depending on your structure
        createdAt: new Date(),
      };

      // Get Firestore instance and add the new recipe to the "recipes" collection
      const db = getFirestore();
      await addDoc(collection(db, "recipes"), recipeData);

      setLoading(false);
      navigate("/");  // Navigate to the homepage or other appropriate page
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

          <div className="flex justify-center mb-24">
            <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? "cursor-not-allowed opacity-50" : ""}`} disabled={loading}>
              {loading ? "Uploading..." : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewRecipe;
