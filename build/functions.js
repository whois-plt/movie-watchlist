// API key
export const apiKey = "f3b390e6"

// input listens to Enter key
export default function enableSearchOnEnter(input, btn, movieInput) {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      localStorage.setItem("movieInput", movieInput)
      btn.click()
    }
  })
}
