import { createClient } from '@/utils/supabase/client'

interface InputItem {
    question: string;
    answer: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
  }
  
  interface OutputItem {
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  const convertToDesiredFormat = (input: InputItem[]): OutputItem[] => {
    return input.map((item) => ({
      question: item.question,
      options: [item.option_1, item.option_2, item.option_3, item.option_4],
      correctAnswer: item.answer,
    }));
  };
// questions for vocab lessons

export async function vocabQuestions(l: number) {
    const supabase = createClient()
    let table = "vocab_words"
    let id = 0
    const questions = []

    for (let i: number = 0; i<5; i++) {
        if (l >0 && l<251) {
            id = Math.floor(Math.random()*147 +1)
            table = "vocab_words"
        }
        else if (l > 250 && l < 401) {
            id = Math.floor(Math.random()*73 +1)
            table = "advanced_words"
        }
        else if (l > 400 && l<501) {
            id = Math.floor(Math.random()*86 +1)
            table = "hard_words"
        }
        const {data, error} = await supabase
        .from(table)
        .select('question, answer, option_1, option_2, option_3, option_4')
        .eq('id', id)

        if(data){
        
            const output: OutputItem[] = convertToDesiredFormat(data);

            questions[i] = output[0]
  
        }
        if (error) {
            console.log(error)
        }
    }
    return questions

}

export async function UpdateLevel(level : number, email: string ) {
    const supabase = await createClient() 

    const { error } =  await supabase
        .from('users')
        .update({'level': ++level})
        .eq('email', email)

    if (error) console.log(error)
 }




// searching detailed meaning from the free api
export async function searchMeanings(word: string) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      if (!response.ok) {
        throw new Error('Word not found')
      }
      const data = await response.json()

      return data
      
    } catch (err) {
      console.log(err)
    }
}

// function to add searched word, answer and options meaning to questions table
export async function addSearchedWord(word: string) {
    const supabase = createClient()
    
    const data_meaning = await searchMeanings(word)
    const meaning = data_meaning[0].meanings[0].definitions[0].definition

    const totalQuestions = await totalNoofQuestions()

    if(totalQuestions) {
        const options = []
        let i=2
        while(i > -1) {
            const data = await fetchMeanings(Math.floor(Math.random()*totalQuestions + 1))
            if (data) {
                if (data[0] !== undefined) {
                    options[i] = data[0].word
                    i = i - 1
                }
                else {
                    continue
                }
            }
        } 
        options[3] = word

        function shuffleArray<T>(array: T[]): T[]{
            for (let i = array.length - 1; i > 0; i--) {
              // Generate a random index from 0 to i
              const j = Math.floor(Math.random() * (i + 1));
              // Swap elements at indices i and j
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }
    
        const s_array = shuffleArray(options)
        
        const { data, error } = await supabase
            .from("question")
            .insert([{word: word, answer: meaning, option_1: s_array[0], option_2: s_array[1], option_3: s_array[2], option_4: s_array[3]}])
            
    
            if (error) {
                console.log('error inserting data:', error)
            }
            else {
                console.log('Inserted data:', data)
            }
    }
}



// function to get the total number of questions in question table
async function totalNoofQuestions() {
    const supabase = createClient()
    const {data, error} = await supabase
        .from('question')
        .select('*', { count: 'exact' });

        if (error) {
            console.error(error);
          } else {
            return data.length
          }
}

// gets the answer of the given id for making options
async function fetchMeanings(id: number) {
    const supabase = createClient()
    const {data,error} = await supabase
        .from('question')
        .select(`word`)
        .eq('id', id)
        
    if (error) {
        console.log(error)
        throw error
        }
    if (data) {
        return data
    }
}

// function to fetch word, answer and options for a given id from the question table
async function fetchQuestions(id: number) {
    const supabase = createClient()
    const {data, error} = await supabase
        .from("question")
        .select('word, answer, option_1, option_2, option_3, option_4')
        .eq('id', id)

    if (error) {
        console.log(error)
        throw error
        
    }
    if (data) {
        if (data[0] !== undefined) {
            console.log(id, data[0])
            return data[0]

        }
    }
   
    return undefined
}

// function to get 10 random questions from question table
export async function fetchRapidQuestions() {
    const totalQuestions = await totalNoofQuestions()
    const questions = []
    let i: number = 0
    while (i<10) {
        if (totalQuestions) {
            const data = await fetchQuestions(Math.floor(Math.random() * totalQuestions + 1))
            
                if (data !== undefined) {
                    questions[i] = data
                    i++
                }
                else {
                    continue
                }
                
            
           
        }
            
    }
   return questions
    
}

// this function returns the array of words that the users have searched during the past
export async function fetchUserWords(email: string) {
    let words: string[] = []

    const supabase = createClient()
    const {data, error} = await supabase
        .from("new_words")
        .select(`word`)
        .eq('email', email)
        .order('created_at', { ascending: false})

    if (error) {
        return []
    }
    if (data) {
       words = data.map((item: { word: string }) => item.word)
       
    }
    return words
} 


// this function fetches review questions 
export async function fetchReviewQuestions(words: string[]) {
    const supabase = createClient()
    let i: number = 0, n = 10, j : number = 0
    console.log(words)
    const questions = []
    if (words.length < 10)
        n = words.length
    try {
        const questions = []; // Initialize array
        
        // Better to use for...of loop for async operations
        for (const word of words) {
            const { data, error } = await supabase
                .from('question')
                .select('word, answer, option_1, option_2, option_3, option_4')
                .ilike('word', word);
            
            if (error) {
                console.error('Error fetching question:', error);
                continue; // Skip to next word if error
            }
            
            if (data && data[0]) {
                console.log('Found question:', data[0]);
                questions.push(data[0]); // Add to array
            }
        }
        
        console.log('All questions:', questions);
        return questions;
    } catch (err) {
        console.error('Error in fetchQuestions:', err);
        return []; // Return empty array on error
    }
}
// this function updates the score of the user
export async function UpdateScore(email: string, score: number,correct: number, wrong: number) {
    const supabase = createClient()

    let newPoints, newCorrect, newWrong
    const {data, error} = await supabase.from('users').select('points, correct, wrong').eq('email', email)
    
    if (data) {
         newPoints = data[0].points + score
         newCorrect = data[0].correct + correct
         newWrong = data[0].wrong + wrong
        
        console.log(error)
    }
    await supabase
            .from('users')
            .update({'points': newPoints, 'correct': newCorrect, 'wrong': newWrong})
            .eq('email', email)
    
}

// this function updates the frequency of the words correct by the user
export async function UpdateFrequency(email: string, word: string) {
    const supabase = createClient()

    console.log(email, word)

    const {data, error} = await supabase
        .from('new_words')
        .select('frequency')
        .eq('email', email)
        .ilike('word', word)
        

    
    if (data) {
        console.log(data)
        const new_freq = data[0]?.frequency + 1
        console.log(new_freq)

        
        const {error} = await supabase
            .from('new_words')
            .update({'frequency': new_freq})
            .eq('email', email)
            .ilike('word', word)
        console.log(error)
    }
    if (error) {
        console.log(error)
    }

}

export async function getLearners() {
    const supabase = createClient()

    const {data, error} = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, points, correct, wrong')
                    .order('points', {ascending : false})
                    .limit(5)
    
    if(data!== undefined) {
        return data
    }
    if (error) {
        console.log(error)
    }
}

export async function getQuestionId(word: string) {
    const supabase = createClient()
    const { data, error } = await (await supabase)
        .from('question')
        .select('id')
        .ilike('word', word);

    if (error) {
        console.log(error)
    }
    if (data) {
        return data?.[0]?.id ? Number(data[0].id) : 0;
    }

    return 0
}

export async function getWordTime(word : string, email: string) {
    const supabase = createClient()
    const { data , error } = await( await supabase)
        .from('new_words')
        .select('created_at')
        .ilike('word', word)
        .eq('email', email)

    if (data) {
        return (data)
    }
    if (error) {
        console.log(error)
        return null
    }
}
