// import OpenAI from "openai";
// import "dotenv/config";
// const api_key = "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";
// const openai = new OpenAI({
//   apiKey: api_key,
// });

// export async function GenerateQuizDataAI(data) {
//   console.log("what is the length", data.length);
//   if (!data) return;
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: `
//           in this array of objects which is 30 words from the 1100 essential word for ielts and spacicfied the complexity of each word
//           and categorized based on levels
//           ${data}
//           choose 10 unique words from this array to use as the data for making a quiz for the user
//           generate the response in json format with only word property and put it in quizData property
//           `,
//       },
//     ],
//     model: "gpt-3.5-turbo",
//     max_tokens: 300,
//     response_format: { type: "json_object" },
//   });
//   console.log(completion.choices[0].message.content);
//   return completion.choices[0].message.content;
// }

// export const getNextLevel = async (userKnowledge) => {
//   if (!userKnowledge) return;
//   console.log("in function");
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: `In my application I am teaching vocablularies to users based on the the 1100 essential words ielts
//         based on my assessments my current user already know
//         ${userKnowledge} these words
//         I want you to pick 5 words and return in json format for the next level based on the 1100 essential words ielts book consider that
//         the array that i provide the words that user already know so don't repeat them in next level
//         involve vacabularies with different levels of complexity while choosing
//         here is the json format that i expect for the response

//         interface IWord {
//           id: string;
//           word: string;
//           meaning: string;
//           complexity: number;
//           academicSynonym: string;
//           defaultlevel: number | undefined;
//           partOfSpeach: string;
//           example: string;
//         }
//         `,
//       },
//     ],

//     Authorization: `Bearer ${api_key}`,
//     model: "gpt-3.5-turbo",
//     max_tokens: 1,
//     response_format: { type: "json_object" },
//   });

//   console.log(completion.choices[0].message.content);
//   return completion.choices[0].message.content;
// };
