import { Button } from "@mui/material"
import { green, purple } from "@mui/material/colors"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[700]
    }
  }
})

const Palette = () => {
  return (
    <ThemeProvider theme={theme}>
      <Button>Primary</Button>
      <Button color="secondary">Secondary</Button>
    </ThemeProvider>
  )
}

export default Palette