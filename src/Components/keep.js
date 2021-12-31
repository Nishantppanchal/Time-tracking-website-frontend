{/* Grid for the two buttons*/}
<Grid container direction='row' spacing={8} className='buttonGrid'>
<Grid item xs={6}> {/* Let button fill half the grid */}
    {/* Login button */}
    <Button variant='contained' fullWidth onClick={handleLoginButton} >Login</Button>
</Grid>
<Grid item xs={6}> {/* Let button fill half the grid */}
    {/* Sign up button */}
    <Button variant='contained' fullWidth onClick={handleSignUpButton}>SIGN UP</Button>
</Grid>
</Grid>