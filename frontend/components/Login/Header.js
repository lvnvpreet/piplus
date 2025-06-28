import { Box, Typography } from '@material-ui/core'

const Header = () => {
  return (
    <>
      <Box px={2} mt={4}>
        <Typography style={{ fontFamily: 'Montserrat', fontSize: '2.5rem', fontWeight: 600}} color="secondary" align="center">
          Welcome back, <br /> Devender Garg!
        </Typography>
      </Box>
    </>
  )
}

export default Header
