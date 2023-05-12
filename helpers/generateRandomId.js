const generateRandomId = () => {
  const digits = '01234'
  let result = ''
  const digitsLength = digits.length
  for (let i = 0; i < 4; i++) {
    result += digits.charAt(Math.floor(Math.random() * digitsLength))
  }
  return result
}

export { generateRandomId }
