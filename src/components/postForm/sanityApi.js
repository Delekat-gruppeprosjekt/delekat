// import { SANITY_TOKEN, projectId, dataset } from "../constants";

// const userId = "65f746b1-8056-4075-a400-c2384ca31dd9";

// async function uploadImageToSanity(imageFile) {
//   const formData = new FormData();
//   formData.append("file", imageFile);

//   const response = await fetch(
//     `https://${projectId}.api.sanity.io/v2024-03-17/assets/images/${dataset}`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${SANITY_TOKEN}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(`Image upload failed: ${err.message}`);
//   }

//   const data = await response.json();
//   return data.document._id;
// }

// export async function createPostInSanity(postData) {
//   const imageAssetId = await uploadImageToSanity(postData.image);

//   const mutations = {
//     mutations: [
//       {
//         create: {
//           _type: "post",
//           title: postData.title,
//           description: postData.description,
//           instructions: postData.instructions,
//           likes: 0,
//           ingredients: postData.ingredients,
//           user: { _type: "reference", _ref: userId },
//           image: {
//             _type: "image",
//             asset: {
//               _type: "reference",
//               _ref: imageAssetId,
//             },
//           },
//         },
//       },
//     ],
//   };

//   const response = await fetch(
//     `https://${projectId}.api.sanity.io/v2024-03-17/data/mutate/${dataset}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${SANITY_TOKEN}`,
//       },
//       body: JSON.stringify(mutations),
//     }
//   );

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(`Could not create post: ${err.message}`);
//   }

//   const data = await response.json();
//   return data;
// }
