import { useState } from 'react';
import { createPostInSanity } from './sanityApi';
import Spinner2Burger from '../../components/spinner/Spinner2Burger.jsx';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', value: '', unit: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setError('');

    if (!title || !image) {
      setError('Tittel og bilde er påkrevd.');
      return;
    }

    setLoading(true);

    const post = {
      title,
      description,
      instructions,
      ingredients,
      image,
    };

    try {
      const result = await createPostInSanity(post);
      console.log('Opprettet post:', result);
      alert('Post opprettet!');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner2Burger />;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      {error && <div className="bg-red-100 text-red-btn p-2 rounded">{error}</div>}

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
        required
      />

      <textarea
        placeholder="Beskrivelse"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 p-2 border rounded"
      />

      <h3 className="font-semibold">Ingredienser:</h3>
      {ingredients.map((ing, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="Ingrediens"
            value={ing.ingredient}
            onChange={(e) => handleIngredientChange(i, 'ingredient', e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Verdi"
            value={ing.value}
            onChange={(e) => handleIngredientChange(i, 'value', e.target.value)}
            className="w-1/4 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Enhet"
            value={ing.unit}
            onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)}
            className="w-1/4 p-2 border rounded"
            required
          />
        </div>
      ))}
      <button type="button" onClick={addIngredient} className="text-blue-btn">
        + Legg til ingrediens
      </button>

      <textarea
        placeholder="Instruksjoner"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full h-32 p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-btn text-BGwhite py-2 px-4 rounded"
        disabled={loading}
      >
        Lagre post
      </button>
    </form>
  );
}
