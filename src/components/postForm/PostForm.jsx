

import { useState } from 'react';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', value: '', unit: '' }]);

  const handleIngredientChange = (index, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', value: '', unit: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      title,
      description,
      instructions,
      ingredients,
      image, // vanligvis laster man opp med Sanity image-upload API
    };

    console.log(post);
    // Her sender du dataene til backend/Sanity API.
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <input
        type="text"
        placeholder="Tittel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="block w-full"
      />

      <textarea
        placeholder="Beskrivelse"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 p-2"
      />


        <h3 className="font-semibold">Ingredienser:</h3>
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Ingrediens"
              value={ing.ingredient}
              onChange={(e) => handleIngredientChange(i, 'ingredient', e.target.value)}
              className="w-1/2 p-2"
            />
            <input
              type="number"
              placeholder="Verdi"
              value={ing.value}
              onChange={(e) => handleIngredientChange(i, 'value', e.target.value)}
              className="w-1/4 p-2"
            />
            <input
              type="text"
              placeholder="Enhet"
              value={ing.unit}
              onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)}
              className="w-1/4 p-2"
            />
          </div>
          <button type="button" onClick={addIngredient} className="text-blue-500">
            + Legg til ingrediens
          </button>

      <textarea
        placeholder="Instruksjoner"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full h-32 p-2"
      />

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Lagre post
      </button>
    </form>
  );
}
