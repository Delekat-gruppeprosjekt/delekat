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
  const [imageError, setImageError] = useState(false);
  const [amountErrors, setAmountErrors] = useState({});
  const navigate = useNavigate();

  // Predefined units for the dropdown
  const units = [
    { value: "ss", label: "Spiseskje (ss)" },
    { value: "ts", label: "Teskje (ts)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "dl", label: "Desiliter (dl)" },
    { value: "L", label: "Liter (L)" },
    { value: "gram", label: "Gram" },
    { value: "stk", label: "Stykk (stk)" }
  ];

  // Function to validate if URL is an image
  const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Function to handle image URL validation
  const handleImageUrlChange = async (url) => {
    if (!url) {
      setImageUrl('');
      setImageError(false);
      return;
    }

    try {
      const isValid = await isValidImageUrl(url);
      if (isValid) {
        setImageUrl(url);
        setImageError(false);
      } else {
        setImageError(true);
        setImageUrl('');
      }
    } catch (error) {
      setImageError(true);
      setImageUrl('');
    }
  };

  // Fetch the user's avatar URL from Firestore
  useEffect(() => {
    const fetchUserAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setAuthorAvatarUrl(userData.avatarUrl || "/assets/avatar_placeholder.png");
          } else {
            console.log("Ingen brukerdata funnet");
            setAuthorAvatarUrl("/assets/avatar_placeholder.png");
          }
        } catch (error) {
          console.error("Feil ved henting av brukerdata: ", error);
        }
      }
    };

    fetchUserAvatar();
  }, []);

  const handleInputChange = (e, index, type) => {
    if (type === "ingredient") {
      const { name, value } = e.target;
      const newIngredients = [...ingredients];
      
      if (name === "amount") {
        // Only allow numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          newIngredients[index][name] = value;
          // Update amount errors
          setAmountErrors(prev => ({
            ...prev,
            [index]: value === "" ? "Mengde er påkrevd" : null
          }));
        }
      } else {
        newIngredients[index][name] = value;
      }
      
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
    // Remove error for deleted ingredient
    setAmountErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
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
      if (imageError) {
        alert("Vennligst skriv inn en gyldig bilde-URL.");
        setLoading(false);
        return;
      }

      // Validate all amounts before submission
      const newAmountErrors = {};
      ingredients.forEach((item, index) => {
        if (!item.amount || isNaN(item.amount) || parseFloat(item.amount) <= 0) {
          newAmountErrors[index] = "Mengde er påkrevd";
        }
      });

      if (Object.keys(newAmountErrors).length > 0) {
        setAmountErrors(newAmountErrors);
        setLoading(false);
        return;
      }

      // Get the current user's display name and ID
      const author = auth.currentUser.displayName || "Anonym";
      const authorId = auth.currentUser.uid;

      // Prepare recipe data
      const recipeData = {
        title,
        description,
        ingredients: ingredients.map(item => ({
          ...item,
          amount: parseFloat(item.amount)
        })),
        instructions,
        imageUrl,
        author,
        authorAvatarUrl,
        userId: authorId,
        createdAt: new Date(),
      };

      // Save recipe to Firestore
      const db = getFirestore();
      await addDoc(collection(db, "recipes"), recipeData);

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Feil ved lagring av oppskrift: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Opprett ny oppskrift</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="title">Tittel</label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Oppskriftens tittel" />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="imageUrl">Bilde-URL</label>
            <input 
              type="text" 
              id="imageUrl" 
              name="imageUrl" 
              value={imageUrl} 
              onChange={(e) => handleImageUrlChange(e.target.value)} 
              required 
              className={`w-full p-2 border rounded-md ${imageError ? 'border-red-500' : ''}`} 
              placeholder="Skriv inn bilde-URL" 
            />
            {imageError && (
              <span className="text-red-500 text-sm mt-1">Ugyldig bilde-URL. Vennligst sjekk at URL-en er korrekt og at den peker til et bilde.</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold" htmlFor="description">Beskrivelse</label>
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded-md" placeholder="Skriv en beskrivelse av oppskriften" />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold">Ingredienser</label>
            {ingredients.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input type="text" name="ingredient" value={item.ingredient} onChange={(e) => handleInputChange(e, index, "ingredient")} className="w-1/3 p-2 border rounded-md" placeholder="Ingrediens" />
                <div className="w-1/4 flex flex-col">
                  <input 
                    type="text" 
                    name="amount" 
                    value={item.amount} 
                    onChange={(e) => handleInputChange(e, index, "ingredient")} 
                    className={`p-2 border rounded-md ${amountErrors[index] ? 'border-red-500' : ''}`} 
                    placeholder="Mengde" 
                  />
                  {amountErrors[index] && (
                    <span className="text-red-500 text-xs mt-1">{amountErrors[index]}</span>
                  )}
                </div>
                <select 
                  name="unit" 
                  value={item.unit} 
                  onChange={(e) => handleInputChange(e, index, "ingredient")} 
                  className="w-1/4 p-2 border rounded-md"
                >
                  <option value="">Velg enhet</option>
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500">Fjern</button>
              </div>
            ))}
            <button type="button" onClick={handleAddIngredient} className="text-blue-500 mt-2">+ Legg til ingrediens</button>
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-semibold">Fremgangsmåte</label>
            {instructions.map((step, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="font-bold">{index + 1}.</span>
                <input type="text" value={step} onChange={(e) => handleInputChange(e, index, "instruction")} className="w-full p-2 border rounded-md" placeholder={`Trinn ${index + 1}`} />
                <button type="button" onClick={() => handleRemoveInstruction(index)} className="text-red-500">Fjern</button>
              </div>
            ))}
            <button type="button" onClick={handleAddInstruction} className="text-blue-500 mt-2">+ Legg til trinn</button>
          </div>

          <div className="flex justify-center mb-24">
            <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? "cursor-not-allowed opacity-50" : ""}`} disabled={loading}>
              {loading ? "Lagrer..." : "Lagre oppskrift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewRecipe;
