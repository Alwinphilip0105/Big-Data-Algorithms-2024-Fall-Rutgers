import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import data from './questions.json';

const Question = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState([]); // State to store answers
  const navigate = useNavigate();

  const personalityTestQuestions = data.personalityTestQuestions;

  // Handle empty or missing questions
  if (!personalityTestQuestions || personalityTestQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const handleNextQuestion = () => {
    // Add the current answer to the array
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: personalityTestQuestions[currentQuestionIndex].question, rating },
    ]);

    // Move to the next question and reset the rating
    if (currentQuestionIndex < personalityTestQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRating(0); // Reset rating for the next question
    }
  };

  const handleSubmit = async () => {
    // Create a local variable to include the final answer
    const updatedAnswers = [
      ...answers,
      { question: personalityTestQuestions[currentQuestionIndex].question, rating },
    ];
    
    console.log('Submitting answers:', updatedAnswers); // Log the updated answers
    
    // Send the updatedAnswers array to the Node.js server
    try {
      const response = await fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnswers),
      });
  
      if (!response.ok) {
        console.error('Failed to send answers to the server');
      } else {
        const responseData = await response.json(); // Parse the JSON response
        console.log("Data from Node ==>>"+JSON.stringify(responseData, null, 2));

        const edu_categories = responseData.edu_categories
        const edu_values_2019_scaled = responseData.edu_values_2019_scaled
        const edu_values_2023_scaled = responseData.edu_values_2023_scaled

        const occ_title = responseData.occ_title;
        const a_median_2019 = responseData.a_median_2019;
        const a_median_2023 = responseData.a_median_2023;

        const occupational_groups = responseData.occupational_groups;
        const skill_data = responseData.skill_data;
        const skill_column = responseData.skill_column;
        if (responseData.final_scores) {
          const finalScores = responseData.final_scores.map(score => score * 100); // Multiply scores by 100
          console.log('Final scores:', finalScores);
  
          // Pass the data as state during navigation
        navigate('/chart', { 
            state: { 
              finalScores, 
              edu_categories, 
              edu_values_2019_scaled, 
              edu_values_2023_scaled, 
              occ_title, 
              a_median_2019, 
              a_median_2023, 
              occupational_groups, 
              skill_data,
              skill_column 
            } 
          });
        } else {
          console.error('final_scores not found in the server response.');
        }
      }
    } catch (error) {
      console.error('Error sending answers:', error);
    }
  };
  

  return (
    <div className="questionContainer">
      <h2 id="question">{personalityTestQuestions[currentQuestionIndex].question}</h2>
      <div className="ratingContainer">
        <br />
        <input
          id="ratingInput"
          type="range"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <br />
        <span id="ratingValue">{rating}</span>
      </div>
      {currentQuestionIndex === personalityTestQuestions.length - 1 ? (
        <button type="submit" className="btn" onClick={handleSubmit}>
          Submit
        </button>
      ) : (
        <button className="btn" onClick={handleNextQuestion}>
          Next Question
        </button>
      )}
    </div>
  );
};

export default Question;
