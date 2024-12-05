import { createClient } from '@/utils/supabase/client'

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
                    options[i] = data[0].answer
                    i = i - 1
                }
                else {
                    continue
                }
            }
        } 
        options[3] = meaning

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
        .select(`answer`)
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
export async function fetchUserWords(userID: string) {
    let words = []

    const supabase = createClient()
    const {data, error} = await supabase
        .from("words")
        .select(`word`)
        .eq('userID', userID)

    if (error) {
        return []
    }
    if (data) {
       words = data.map((item: { word: any }) => item.word)
    }
    return words
} 


// this function fetches review questions 
export async function fetchReviewQuestions(words: any[]) {
    const supabase = createClient()
    let i: number = 0
    const questions = []
    while (i < words.length) {
        const {data, error} = await supabase
            .from('question')
            .select('word, answer, option_1, option_2, option_3, option_4')
            .eq('word', words[i])
        
        if (error) {
            console.log(error)
        }
        if (data) {
            questions[i] = data[0]
        }
        i++
    }

    return questions
}



