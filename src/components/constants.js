export const SANITY_TOKEN =
  process.env.REACT_APP_SANITY_TOKEN ||
  'skRQDp3TfnhfkhM1hX2tgPk0ObOIPxnIl88FFztLUwD3bvaHNyM1TjYDzuzVlX4hBHsSniTTQS3k1Fz7Nh2tV5rZjbqH5nJinxnerJfFtyRRLecT0tB92Tx2p6zp0QuFXnSxKCQAT11cBMD9MoN3RV4NaRzks5oK3sNEq2XPTvLHz9qRNN4W'

  export const API_ALL_POSTS = "https://jab3uxlh.api.sanity.io/v2025-03-17/data/query/production?query=*%5B_type+%3D%3D+%22post%22%5D+%7C+order%28_createdAt+desc%29+%7B%0A++_id%2C%0A++title%2C%0A++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++description%2C%0A++likes%2C%0A++ingredients%5B%5D%7B%0A++++ingredient%2C%0A++++value%2C%0A++++unit%0A++%7D%2C%0A++instructions%2C%0A++user-%3E%7B%0A++++username%2C%0A++++%22avatarUrl%22%3A+avatar.asset-%3Eurl%0A++%7D%2C%0A++%22comments%22%3A+*%5B_type+%3D%3D+%22comment%22+%26%26+post._ref+%3D%3D+%5E._id+%26%26+approved+%3D%3D+true%5D+%7C+order%28createdAt+asc%29+%7B%0A++++_id%2C%0A++++text%2C%0A++++createdAt%2C%0A++++author-%3E%7B%0A++++++username%2C%0A++++++%22avatarUrl%22%3A+avatar.asset-%3Eurl%0A++++%7D%0A++%7D%0A%7D%0A%0A";

export const API_SINGLE_POST_PART_1 = "https://jab3uxlh.api.sanity.io/v2025-03-17/data/query/production?query=+*%5B_type+%3D%3D+%22post%22+%26%26+_id+%3D%3D+%24id%5D%5B0%5D+%7B%0A++_id%2C%0A++title%2C%0A++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++description%2C%0A++likes%2C%0A++ingredients%5B%5D%7B%0A++++ingredient%2C%0A++++value%2C%0A++++unit%0A++%7D%2C%0A++instructions%2C%0A++user-%3E%7B%0A++++username%2C%0A++++%22avatarUrl%22%3A+avatar.asset-%3Eurl%0A++%7D%2C%0A++%22comments%22%3A+*%5B_type+%3D%3D+%22comment%22+%26%26+post._ref+%3D%3D+%5E._id+%26%26+defined%28text%29%5D+%7C+order%28createdAt+asc%29+%7B%0A++++text%2C%0A++++createdAt%2C%0A++++author-%3E%7B%0A++++++username%2C%0A++++++%22avatarUrl%22%3A+avatar.asset-%3Eurl%0A++++%7D%0A++%7D%0A%7D%0A%0A%0A&%24id=%22";

export const API_SINGLE_POST_PART_2 = "%22";


