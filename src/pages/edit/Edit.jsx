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
  const [imageError, setImageError] = useState(false);
  const [amountErrors, setAmountErrors] = useState({});
  const [difficulty, setDifficulty] = useState("lett");
  const [formErrors, setFormErrors] = useState({});
  const [portions, setPortions] = useState(1);
  const [cookingTime, setCookingTime] = useState("10 - 15 min");

  // Predefined units for the dropdown
  const units = [
    { value: "ss", label: "Spiseskje (ss)" },
    { value: "ts", label: "Teskje (ts)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "dl", label: "Desiliter (dl)" },
    { value: "L", label: "Liter (L)" },
    { value: "gram", label: "Gram" },
    { value: "stk", label: "Stykk (stk)" },
    { value: "boks", label: "Boks(er)" }
  ];

  // Predefined cooking times
  const cookingTimes = [
    "5 - 10 min",
    "10 - 15 min",
    "15 - 20 min",
    "20 - 25 min",
    "25 - 30 min",
    "30 - 35 min",
    "35 - 40 min",
    "40 - 45 min",
    "45 - 50 min",
    "50 - 55 min",
    "55 - 60 min",
    "60+ min"
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(firestore, "recipes", recipeId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Check if the logged-in user is the owner
          if (data.userId !== auth.currentUser?.uid) {
            navigate("/"); // Navigate back to the previous page
            return;
          }
  
          setTitle(data.title || "");
          setImageUrl(data.imageUrl || "");
          setDescription(data.description || "");
          setIngredients(Array.isArray(data.ingredients) ? data.ingredients : [{ ingredient: "", amount: "", unit: "" }]);
          setInstructions(Array.isArray(data.instructions) ? data.instructions : [""]);
          setDifficulty(data.difficulty || "lett");
          setPortions(data.portions || 1);
          setCookingTime(data.cookingTime || "10 - 15 min");
        } else {
          console.error("No such recipe found!");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
  
    fetchRecipe();
  }, [recipeId, navigate]);
  

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
          setDifficulty(data.difficulty || "lett");
          setPortions(data.portions || 1);
          setCookingTime(data.cookingTime || "10 - 15 min");
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
      
      if (name === "amount") {
        // Only allow numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          newIngredients[index][name] = value;
          // Update amount errors
          const numValue = parseFloat(value);
          setAmountErrors(prev => ({
            ...prev,
            [index]: value === "" ? "Mengde er påkrevd" : 
                     isNaN(numValue) ? "Ugyldig nummer" :
                     numValue > 9999 ? "Mengde kan ikke være større enn 9999" : null
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

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (imageError) {
        alert("Vennligst skriv inn en gyldig bilde-URL.");
        setLoading(false);
        return;
      }

      // Validate title
      if (!title.trim()) {
        setFormErrors(prev => ({ ...prev, title: "Tittel er påkrevd" }));
        setLoading(false);
        return;
      }

      // Validate description
      if (!description.trim()) {
        setFormErrors(prev => ({ ...prev, description: "Beskrivelse er påkrevd" }));
        setLoading(false);
        return;
      }

      // Validate ingredients
      const newAmountErrors = {};
      let hasIngredientErrors = false;
      ingredients.forEach((item, index) => {
        if (!item.ingredient.trim()) {
          hasIngredientErrors = true;
        }
        if (!item.amount || isNaN(item.amount) || parseFloat(item.amount) <= 0) {
          newAmountErrors[index] = "Mengde er påkrevd";
          hasIngredientErrors = true;
        }
        if (!item.unit) {
          hasIngredientErrors = true;
        }
      });

      if (hasIngredientErrors) {
        setAmountErrors(newAmountErrors);
        alert("Vennligst fyll ut alle ingrediensfeltene");
        setLoading(false);
        return;
      }

      // Validate instructions
      if (instructions.some(step => !step.trim())) {
        alert("Vennligst fyll ut alle trinnene i fremgangsmåten");
        setLoading(false);
        return;
      }

      const recipeRef = doc(firestore, "recipes", recipeId);
      await updateDoc(recipeRef, {
        title,
        description,
        ingredients: ingredients.map(item => ({
          ...item,
          amount: parseFloat(item.amount)
        })),
        instructions,
        imageUrl,
        difficulty,
        portions: Number(portions),
        cookingTime,
        updatedAt: new Date(),
      });
      
      setLoading(false);
      navigate(`/profile/${auth.currentUser.uid}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setLoading(false);
    }
  };

  const handlePortionChange = (newPortions) => {
    if (newPortions >= 1 && newPortions <= 99) {
      setPortions(newPortions);
    }
  };

  return (
    <div className="min-h-screen bg-BGcolor p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-BGwhite rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Rediger oppskrift</h1>
          <form onSubmit={handleUpdateRecipe} className="space-y-6">
            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="title">Tittel</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={title} 
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setTitle(e.target.value);
                  }
                }}
                required 
                maxLength={60}
                className={`w-full p-2 border border-PMgreen rounded-md ${formErrors.title ? 'border-red-btn' : ''}`}
                placeholder="Oppskriftens tittel" 
              />
              <span className="text-sm text-gray-500 mt-1">
                {title.length}/60 tegn
              </span>
              {formErrors.title && (
                <span className="text-red-btn text-sm mt-1">{formErrors.title}</span>
              )}
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
                className={`w-full p-2 border border-PMgreen rounded-md ${imageError ? 'border-red-btn' : ''}`} 
                placeholder="Skriv inn bilde-URL" 
              />
              {imageError && (
                <span className="text-red-btn text-sm mt-1">Ugyldig bilde-URL. Vennligst sjekk at URL-en er korrekt og at den peker til et bilde.</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="description">Beskrivelse</label>
              <textarea 
                id="description" 
                name="description" 
                value={description} 
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setDescription(e.target.value);
                  }
                }} 
                required 
                className="w-full p-2 border border-PMgreen rounded-md" 
                placeholder="Skriv en beskrivelse av oppskriften"
                maxLength={1000}
              />
              <span className="text-sm text-gray-500 mt-1">{description.length}/1000 tegn</span>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="difficulty">Vanskelighetsgrad</label>
              <select
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border border-PMgreen rounded-md"
              >
                <option value="lett">Lett (1 kokkehatt)</option>
                <option value="medium">Medium (2 kokkehatter)</option>
                <option value="vanskelig">Vanskelig (3 kokkehatter)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="portions">Antall porsjoner</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handlePortionChange(portions - 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#3C5A3C] text-[#3C5A3C] hover:bg-[#3C5A3C] hover:text-white transition-colors ${portions <= 1 ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-[#3C5A3C]" : ""}`}
                  disabled={portions <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="portions"
                  name="portions"
                  value={portions}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numeric values
                    if (value === "" || /^\d+$/.test(value)) {
                      setPortions(value);
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue > 99) {
                        setPortions("99");
                      }
                    }
                  }}
                  onBlur={() => {
                    const numValue = parseInt(portions);
                    if (portions === "" || isNaN(numValue) || numValue < 1) {
                      setPortions("1");
                    }
                  }}
                  className="w-16 p-2 border border-[#438407] rounded-md text-center"
                  required
                  title="Maksimalt antall porsjoner er 99"
                />
                <button
                  onClick={() => handlePortionChange(portions + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#3C5A3C] text-[#3C5A3C] hover:bg-[#3C5A3C] hover:text-white transition-colors ${portions >= 99 ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-[#3C5A3C]" : ""}`}
                  disabled={portions >= 99}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="cookingTime">Tilberedningstid</label>
              <select
                id="cookingTime"
                name="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full p-2 border border-PMgreen rounded-md"
                required
              >
                {cookingTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold">Ingredienser</label>
              {ingredients.map((item, index) => (
                <div key={index} className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <textarea 
                        name="ingredient" 
                        value={item.ingredient} 
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            handleInputChange(e, index, "ingredient");
                          }
                        }}
                        className="w-full p-2 border border-PMgreen rounded-md resize-none min-h-[38px] max-h-[100px]" 
                        placeholder="Ingrediens"
                        required
                        maxLength={100}
                        rows={1}
                      />
                      <span className="text-sm text-gray-500 mt-1">
                        {item.ingredient.length}/100 tegn
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <input 
                      type="text" 
                      inputMode="decimal"
                      name="amount" 
                      value={item.amount} 
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow numbers and single decimal point
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handleInputChange(e, index, "ingredient");
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue) && numValue > 9999) {
                            const newIngredients = [...ingredients];
                            newIngredients[index].amount = "9999";
                            setIngredients(newIngredients);
                          }
                        }
                      }}
                      onBlur={() => {
                        const numValue = parseFloat(item.amount);
                        if (item.amount === "" || isNaN(numValue) || numValue <= 0) {
                          const newIngredients = [...ingredients];
                          newIngredients[index].amount = "1";
                          setIngredients(newIngredients);
                        }
                      }}
                      className="w-full p-2 border border-PMgreen rounded-md" 
                      placeholder="Mengde"
                      required
                      title="Maksimal mengde er 9999"
                    />
                  </div>
                  <select 
                    name="unit" 
                    value={item.unit} 
                    onChange={(e) => handleInputChange(e, index, "ingredient")} 
                    className="w-1/4 p-2 border border-[PMgreen rounded-md"
                    required
                  >
                    <option value="">Velg enhet</option>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-btn hover:text-red-btn-hover cursor-pointer mt-1">Fjern</button>
                </div>
              ))}
              <button type="button" onClick={handleAddIngredient} className="text-blue-btn hover:text-blue-btn-hover cursor-pointer mt-2">+ Legg til ingrediens</button>
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold">Fremgangsmåte</label>
              {instructions.map((step, index) => (
                <div key={index} className="flex gap-2 items-start mb-4">
                  <span className="font-bold">{index + 1}.</span>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <textarea 
                        value={step} 
                        onChange={(e) => {
                          if (e.target.value.length <= 300) {
                            handleInputChange(e, index, "instruction");
                          }
                        }}
                        className="w-full p-2 border border-[#438407] rounded-md resize-none min-h-[38px] max-h-[150px]" 
                        placeholder={`Trinn ${index + 1}`} 
                        required
                        maxLength={300}
                        rows={1}
                      />
                      <span className="text-sm text-gray-500 mt-1">
                        {step.length}/300 tegn
                      </span>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveInstruction(index)} className="text-red-btn hover:text-red-btn-hover cursor-pointer">Fjern</button>
                </div>
              ))}
              <button type="button" onClick={handleAddInstruction} className="text-blue-btn hover:text-blue-btn-hover cursor-pointer mt-2">+ Legg til trinn</button>
            </div>

            <div className="flex justify-end space-x-4 mb-24">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-BGwhite px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Avbryt
              </button>
              <button 
                type="submit" 
                className={`bg-green-btn text-BGwhite px-4 py-2 rounded-md hover:bg-green-btn-hover ${loading ? "cursor-not-allowed opacity-50" : ""}`} 
                disabled={loading}
              >
                {loading ? "Lagrer..." : "Lagre endringer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRecipe;
