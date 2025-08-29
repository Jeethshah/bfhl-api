app.get('/', (req, res) => {
  res.send('BFHL API is running. Use POST /bfhl to access the API.');
});
const express = require('express');
const app = express();
app.use(express.json());

// Change these values to your own details
const FULL_NAME = 'john_doe'; // lowercase, underscores
const DOB = '17091999'; // ddmmyyyy
const EMAIL = 'john@xyz.com';
const ROLL_NUMBER = 'ABCD123';

function isNumber(str) {
  return /^-?\d+$/.test(str);
}

function isAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isSpecialChar(str) {
  return !isNumber(str) && !isAlphabet(str);
}

function toAlternatingCaps(str) {
  let res = '';
  let upper = true;
  for (let c of str) {
    if (/[a-zA-Z]/.test(c)) {
      res += upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
    }
  }
  return res;
}

app.post('/bfhl', (req, res) => {
  try {
    const data = req.body.data || [];
    let even_numbers = [], odd_numbers = [], alphabets = [], special_characters = [], sum = 0, alpha_concat = '';

    data.forEach(item => {
      if (isNumber(item)) {
        const num = parseInt(item, 10);
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
        sum += num;
      } else if (isAlphabet(item)) {
        alphabets.push(item.toUpperCase());
        alpha_concat += item;
      } else if (isSpecialChar(item)) {
        special_characters.push(item);
      }
    });

    // Prepare concat_string: all alpha chars in input, reversed, alternating caps
    let allAlphaChars = alpha_concat.split('').reverse().join('');
    let concat_string = toAlternatingCaps(allAlphaChars);

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    });
  } catch (e) {
    res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
