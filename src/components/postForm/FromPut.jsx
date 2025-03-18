/*import CreatePostForm from './PostForm';
import { createPostInSanity } from './sanityApi';

const userId = '65f746b1-8056-4075-a400-c2384ca31dd9';

export default function FormPut() {
  const handlePostSubmit = async (postData) => {
    try {
      const response = await createPostInSanity(postData, userId);
      console.log('Post opprettet:', response);
    } catch (error) {
      console.error('Feil:', error.message);
    }
  };

  return <CreatePostForm onSubmit={handlePostSubmit} />;
}

*/